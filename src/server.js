// Server-side code for Cloudflare Worker handling Discord interactions and GT7 tuning calculations
// This file defines the HTTP request handler, command processing logic, and physics calculations for the tune-downforce command.

// It uses the itty-router library for routing and discord-interactions for request verification and response formatting.
import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import { TUNEDOWNFORCE_COMMAND, TUNETRANSMISSION_COMMAND, TUNEDIFFERENTIAL_COMMAND } from './commands.js';
import { analyzeDifferentialTuning } from './diffScatter.js';
import { makeGaugeChartConfig } from './diffScatter.js';
import { TRACK_CHOICES } from './transData.js';
import { CARS } from './cars.js';
import { calculateGripTune } from './tuning.js';
import { JsonResponse } from './utils.js';

// ──────────────────────────────────────────────────────────────
// Handler functions for Discord slash commands
// ──────────────────────────────────────────────────────────────

// Handler for /tune-downforce command
function handleTuneDownforceCommand(interaction) {
  const { data } = interaction;
  const options = Object.fromEntries((data.options ?? []).map(opt => [opt.name, opt.value]));
  const weight = options.weight;
  const front = options.front;
  const tire = options.tire;

  // Perform the core physics calculation with user inputs
  const result = calculateGripTune(weight, front, tire);

  // Check if calculation returned an error (e.g., invalid weight distribution)
  if ('error' in result) {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [
          {
            title: 'Invalid Input',
            description: result.error,
            color: 0xff0000,
          },
        ],
      },
    });
  }

  return new JsonResponse({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [
        {
          title: 'GT7 Grip-Optimized Tuning',
          color: 0xffd700,
          fields: [
            { name: 'Weight', value: `${weight.toLocaleString()} lbs`, inline: false },
            { name: 'Balance', value: `${front}% Front │ ${100 - front}% Rear`, inline: false },
            { name: 'Tire', value: `${result.tireDisplay} (Grip: ${result.grip}g)`, inline: false },
            { name: '**FRONT**', value: `\`\`\`Downforce: ${result.frontDF.padStart(6)}\nNat Freq : ${result.frontNF} Hz\`\`\``, inline: true },
            { name: '**REAR**', value: `\`\`\`Downforce: ${result.rearDF.padStart(6)}\nNat Freq : ${result.rearNF} Hz\`\`\``, inline: true },
          ],
          footer: { text: 'Pure grip focus • No speed trade-off • Values in lbs' },
          timestamp: new Date().toISOString(),
        },
      ],
    },
  });
}

// Handler for /tune-differential command
function handleTuneDifferentialCommand(interaction, env, ctx) {
  const { data, token } = interaction;
  const options = Object.fromEntries((data.options ?? []).map(opt => [opt.name, opt.value]));
  const initialTorque = options.initial_torque;
  const accelerationSensitivity = options.acceleration_sensitivity;
  const brakingSensitivity = options.braking_sensitivity;

  // run the analytic helper to get a title, description, and normalized scales
  const analysis = analyzeDifferentialTuning({
    accelerationSensitivity,
    initialTorque,
    brakingSensitivity,
  });

  // Create promise for follow-up with -10 to 10 numbers for each characteristic
  const followUpPromise = (async () => {
    try {
      // choose a colour based on quadrant thresholds (preserves old palette)
      const isHighAccel = accelerationSensitivity > 30;
      const isHighBraking = brakingSensitivity > 30;
      let embedColor = 0xffd700;
      if (isHighAccel && isHighBraking) embedColor = 0xff6b00;
      else if (isHighAccel && !isHighBraking) embedColor = 0xff0000;
      else if (!isHighAccel && isHighBraking) embedColor = 0x0066ff;
      else embedColor = 0xffff00;


      // Convert normalized values (0..1) to -10..10 scale
      function scaleToNum(val) {
        return Math.round(val * 20 - 10);
      }

      // build embed using analysis output
      const embed = {
        title: analysis.title,
        description: analysis.description,
        color: embedColor,
        fields: [
          { name: 'Initial Torque', value: `${initialTorque.toFixed(1)}`, inline: true },
          { name: 'Accel Sensitivity', value: `${accelerationSensitivity.toFixed(1)}`, inline: true },
          { name: 'Braking Sensitivity', value: `${brakingSensitivity.toFixed(1)}`, inline: true },
          { name: `${analysis.scales.gripDrift.leftLabel} ↔ ${analysis.scales.gripDrift.rightLabel}`,
            value: `${scaleToNum(analysis.scales.gripDrift.value)}`, inline: false },
          { name: `${analysis.scales.underOver.leftLabel} ↔ ${analysis.scales.underOver.rightLabel}`,
            value: `${scaleToNum(analysis.scales.underOver.value)}`, inline: false },
          { name: `${analysis.scales.controlPlay.leftLabel} ↔ ${analysis.scales.controlPlay.rightLabel}`,
            value: `${scaleToNum(analysis.scales.controlPlay.value)}`, inline: false },
          { name: `${analysis.scales.brakeLock.leftLabel} ↔ ${analysis.scales.brakeLock.rightLabel}`,
            value: `${scaleToNum(analysis.scales.brakeLock.value)}`, inline: false },
        ],
        footer: { text: 'Scale: -10 (left) to 10 (right)' },
        timestamp: new Date().toISOString(),
      };

      // send the embed via webhook patch/post as before
      const appId = env.DISCORD_APPLICATION_ID || interaction.application_id || data.application_id;
      if (!appId) {
        console.error('Missing Discord application id (env.DISCORD_APPLICATION_ID or interaction.application_id). Cannot send follow-up.');
        return;
      }

      const webhookBase = `https://discord.com/api/v10/webhooks/${appId}/${token}`;
      const payload = { embeds: [embed] };

      // Try updating the original deferred response first
      const patchUrl = `${webhookBase}/messages/@original`;
      let response = await fetch(patchUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: payload.embeds }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '<no body>');
        console.error(`PATCH original failed: ${response.status} ${response.statusText}`, text);
        response = await fetch(webhookBase, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const fallbackText = await response.text().catch(() => '<no body>');
          console.error(`Fallback POST failed: ${response.status} ${response.statusText}`, fallbackText);
        }
      }
    } catch (error) {
      console.error('Error sending follow-up:', error);
    }
  })();

  // Tell Cloudflare to wait for the follow-up promise before shutting down
  if (ctx && ctx.waitUntil) {
    ctx.waitUntil(followUpPromise);
  }

  // Return deferred response immediately
  return new JsonResponse({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  });
}

// Handler for autocomplete interactions (user typing in a slash command option)
function handleAutocomplete(interaction) {
  const { data } = interaction;
  const focusedOption = data.options?.find(opt => opt.focused);
  
  if (!focusedOption) {
    return new JsonResponse({
      type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
      data: { choices: [] },
    });
  }

  // Handle autocomplete for track selection in tune-transmission command
  if (focusedOption.name === 'track') {
    const focusedValue = focusedOption.value.toLowerCase();
    
    // Filter tracks based on user input
    const filtered = TRACK_CHOICES
      .filter(track => track.name.toLowerCase().includes(focusedValue))
      .slice(0, 25); // Discord limit: max 25 choices shown at a time

    return new JsonResponse({
      type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
      data: {
        choices: filtered.map(track => ({
          name: track.name,
          value: track.value,
        })),
      },
    });
  }

  // Handle autocomplete for car selection in tune-transmission command
  if (focusedOption.name === 'car') {
    const focusedValue = focusedOption.value.toLowerCase();
    
    // Filter cars based on user input
    const filtered = CARS
      .filter(car => car.name.toLowerCase().includes(focusedValue))
      .slice(0, 25); // Discord limit: max 25 choices shown at a time

    return new JsonResponse({
      type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
      data: {
        choices: filtered.map(car => ({
          name: car.name,
          value: car.value,
        })),
      },
    });
  }

  // No matching autocomplete handler
  return new JsonResponse({
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: { choices: [] },
  });
}

// Create router to handle HTTP requests; directs GET/POST to appropriate handlers
const router = AutoRouter();

// GET / route — health check endpoint; returns Discord Application ID to confirm worker is running
router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

// POST / route — main handler for all Discord interactions (ping, slash commands, etc.)
router.post('/', async (request, env, ctx) => {
  // Verify request signature with Discord's public key (prevents unauthorized requests)
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env,
  );
  // Reject request if signature verification failed or interaction object is missing
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }

  // Handle PING interaction (Discord validates webhook URL during setup)
  if (interaction.type === InteractionType.PING) {
    // Return PONG to confirm webhook is responding correctly
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  // Handle APPLICATION_COMMAND_AUTOCOMPLETE interaction (user typing in autocomplete field)
  if (interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
    return handleAutocomplete(interaction);
  }

  // Handle APPLICATION_COMMAND interaction (user typed a slash command)
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Route command to appropriate handler based on command name
    switch (interaction.data.name.toLowerCase()) {
      case TUNEDOWNFORCE_COMMAND.name.toLowerCase(): {
        // User invoked /tune-downforce
        return handleTuneDownforceCommand(interaction);
      }

      case TUNETRANSMISSION_COMMAND.name.toLowerCase(): {
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [{
              title: 'Transmission Tuning',
              description: 'Transmission tuning coming soon!',
              color: 0xffa500,
            }],
          },
        });
      }

      case TUNEDIFFERENTIAL_COMMAND.name.toLowerCase(): {
        return handleTuneDifferentialCommand(interaction, env, ctx);
      }

      default:
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
  }

  // Log error if interaction type is not recognized (type 1 = PING, type 2 = APPLICATION_COMMAND)
  console.error('Unknown Type');
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});

// Catch-all route for unmatched paths
router.all('*', () => new Response('Not Found.', { status: 404 }));

// Verify request authenticity using Discord's public key (prevents request spoofing)
async function verifyDiscordRequest(request, env) {
  // Extract signature and timestamp from request headers
  const signature = request.headers.get('x-signature-ed25519');            // Ed25519 signature
  const timestamp = request.headers.get('x-signature-timestamp');          // Request timestamp
  // Read entire request body as text
  const body = await request.text();
  // Verify signature is valid using Discord's verifyKey function
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  // Return early if verification failed (prevents processing invalid requests)
  if (!isValidRequest) {
    return { isValid: false };
  }

  // Signature valid; parse body and return interaction object
  return { interaction: JSON.parse(body), isValid: true };
}

// Export server object containing request verification function and HTTP router
const server = {
  verifyDiscordRequest,          // Utility function for signature verification
  fetch: router.fetch,           // Main HTTP request handler (passed to Cloudflare Workers)
};

// Export server as default export for Cloudflare Workers runtime
export default server;