// Server-side code for Cloudflare Worker handling Discord interactions and GT7 tuning calculations
// This file defines the HTTP request handler, command processing logic, and physics calculations for the tune-downforce command.

// It uses the itty-router library for routing and discord-interactions for request verification and response formatting.

// ──────────────────────────────────────────────────────────────
// IMPORTS
// ──────────────────────────────────────────────────────────────
import { AutoRouter } from 'itty-router';

import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';

import { 
  TUNEDOWNFORCE_COMMAND, 
  TUNETRANSMISSION_COMMAND, 
  TUNEDIFFERENTIAL_COMMAND,
  RACERESTRICTIONS_COMMAND,
  DAMAGE_CHOICES
} from './commands.js';

import { analyzeDifferentialTuning } from './diffData.js';
import { TRACK_CHOICES, TRANSMISSION_TUNINGS } from './transData.js';
import { TIRE_CHOICES } from './downforceData.js';
import { CARS } from './carData.js';
import { calculateGripTune } from './tuning.js';
import { JsonResponse } from './utils.js';

// ──────────────────────────────────────────────────────────────
// TUNE DOWNFORCE COMMAND HANDLER
// This function processes the /tune-downforce command, performs physics calculations, and returns a formatted response embed.
// ──────────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────────
// TUNE DIFFERENTIAL COMMAND HANDLER
// This function processes the /tune-differential command, analyzes the tuning characteristics, and returns a detailed embed with insights and sliding-scale metrics.
// ──────────────────────────────────────────────────────────────

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
          { name: `**${analysis.scales.gripDrift.leftLabel} / ${analysis.scales.gripDrift.rightLabel}**`,
            value: `\`\`\`${scaleToNum(analysis.scales.gripDrift.value)}\`\`\``, inline: false },
          { name: `**${analysis.scales.underOver.leftLabel} / ${analysis.scales.underOver.rightLabel}**`,
            value: `\`\`\`${scaleToNum(analysis.scales.underOver.value)}\`\`\``, inline: false },
          { name: `**${analysis.scales.controlPlay.leftLabel} / ${analysis.scales.controlPlay.rightLabel}**`,
            value: `\`\`\`${scaleToNum(analysis.scales.controlPlay.value)}\`\`\``, inline: false },
          { name: `**${analysis.scales.brakeLock.leftLabel} / ${analysis.scales.brakeLock.rightLabel}**`,
            value: `\`\`\`${scaleToNum(analysis.scales.brakeLock.value)}\`\`\``, inline: false },
        ],
        footer: { text: 'Key: Grip -10 / 10 Drift' },
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

// ──────────────────────────────────────────────────────────────
// TUNE TRANSMISSION COMMAND HANDLER
// This function processes the /tune-transmission command, looks up track and car data, and returns a transmission tuning embed.
// ──────────────────────────────────────────────────────────────

function handleTuneTransmissionCommand(interaction) {
  const { data } = interaction;
  const options = Object.fromEntries((data.options ?? []).map(opt => [opt.name, opt.value]));
  const trackValue = options.track;
  const carValue = options.car;

  // Look up track and car data
  const trackData = TRANSMISSION_TUNINGS[trackValue];
  const carData = CARS.find(car => car.value === carValue);

  // Validate that both track and car were found
  if (!trackData) {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [{
          title: 'Invalid Track',
          description: `Track "${trackValue}" not found in transmission tuning database.`,
          color: 0xff0000,
        }],
      },
    });
  }

  if (!carData) {
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [{
          title: 'Invalid Car',
          description: `Car "${carValue}" not found in car database.`,
          color: 0xff0000,
        }],
      },
    });
  }

  // Find track name from TRACK_CHOICES
  const trackName = TRACK_CHOICES.find(t => t.value === trackValue)?.name || trackValue;

  // Build gear ratio fields
  const gearFields = Object.entries(trackData.gears).map(([gear, ratio]) => ({
    name: gear,
    value: `\`${ratio.toFixed(3)}\``,
    inline: true,
  }));

  return new JsonResponse({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [{
        title: 'GT7 Transmission Tuning',
        color: 0x1e90ff,
        fields: [
          { name: 'Track', value: `**${trackName}**`, inline: true },
          { name: 'Car', value: `**${carData.name}**`, inline: true },
          { name: 'Drivetrain', value: `**${carData.drivetrain}**`, inline: true },
          { name: 'Final Drive', value: `\`\`\`${trackData.finalDrive.toFixed(3)}\`\`\``, inline: false },
          { name: 'Gear Ratios', value: '\u200b', inline: false },
          ...gearFields,
        ],
        footer: { text: 'Optimize for track characteristics and car setup' },
        timestamp: new Date().toISOString(),
      }],
    },
  });
}

// ──────────────────────────────────────────────────────────────
// RACE RESTRICTIONS COMMAND HANDLER
// This function processes the /race-restrictions command and returns a formatted restrictions message.
// ──────────────────────────────────────────────────────────────

function handleRaceRestrictionsCommand(interaction) {
  const { data } = interaction;
  const options = Object.fromEntries((data.options ?? []).map(opt => [opt.name, opt.value]));
  const name = options.name || '';
  const classOrCar = options.class || '';
  const tyreValue = options.tyre || '';
  const prohibited = options.prohibited || '';
  const damageValue = options.damage || '';
  const notes = options.notes || '';

  // Get current day of the month and add ordinal suffix
  const today = new Date();
  const dayOfMonth = today.getDate();
  
  // Function to add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  function getOrdinalDay(n) {
    if (n > 3 && n < 21) return `${n}th`;
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }
  
  const ordinalDay = getOrdinalDay(dayOfMonth);

  // Look up tire name from TIRE_CHOICES
  const tireChoice = TIRE_CHOICES.find(t => t.value === tyreValue);
  const tyreName = tireChoice ? tireChoice.name : tyreValue;

  // Look up damage name from DAMAGE_CHOICES
  const damageChoice = DAMAGE_CHOICES.find(d => d.value === damageValue);
  const damageName = damageChoice ? damageChoice.name : damageValue;

  // Build the description with proper formatting
  let description = `**${name}**\n\n*Livery Required!!*\n\n**Class :** ${classOrCar}\n\n**Tyre :** ${tyreName}\n\n**Prohibited :** ${prohibited}\n\n**Damage :** ${damageName}`;
  
  if (notes) {
    description += `\n\n${notes}`;
  }

  return new JsonResponse({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      embeds: [{
        title: `Wednesday the ${ordinalDay} Restrictions :`,
        description: description,
        color: 0xff4500, // Orange-red color for visibility
        timestamp: new Date().toISOString(),
      }],
    },
  });
}

// ──────────────────────────────────────────────────────────────
// AUTOCOMPLETE INTERACTION HANDLER
// ──────────────────────────────────────────────────────────────

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
// ──────────────────────────────────────────────────────────────
// ROUTER AND SERVER SETUP
// ──────────────────────────────────────────────────────────────

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
        return handleTuneTransmissionCommand(interaction);
      }

      case TUNEDIFFERENTIAL_COMMAND.name.toLowerCase(): {
        return handleTuneDifferentialCommand(interaction, env, ctx);
      }

      case RACERESTRICTIONS_COMMAND.name.toLowerCase(): {
        return handleRaceRestrictionsCommand(interaction);
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