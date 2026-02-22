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

  // Create promise for follow-up chart generation
  const followUpPromise = (async () => {
    try {
      // Determine user's behavioral quadrant (midpoint is 30 for 0-60 range)
      const isHighAccel = accelerationSensitivity > 30;
      const isHighBraking = brakingSensitivity > 30;
      let quadrantLabel = '';
      let quadrantDescription = '';
      let embedColor = 0xffd700;

      if (isHighAccel && isHighBraking) {
        quadrantLabel = 'Locked & Stable';
        quadrantDescription = 'High lock both accel & braking • Predictable but prone to oversteer on throttle • Best for grip racing';
        embedColor = 0xff6b00;
      } else if (isHighAccel && !isHighBraking) {
        quadrantLabel = 'Oversteer Prone';
        quadrantDescription = 'Strong accel lock, minimal braking lock • Rear slides freely under braking • Aggressive acceleration bias';
        embedColor = 0xff0000;
      } else if (!isHighAccel && isHighBraking) {
        quadrantLabel = 'Understeer Prone';
        quadrantDescription = 'Minimal accel lock, strong braking lock • Front-heavy under braking • Conservative for smooth handling';
        embedColor = 0x0066ff;
      } else {
        quadrantLabel = 'Free Diff';
        quadrantDescription = 'Minimal lock both directions • Loose, drifty feel • Extreme lock-to-lock behavior';
        embedColor = 0xffff00;
      }

      // Create detailed QuickChart with all annotations
      const chartConfig = {
        type: 'scatter',
        data: {
          datasets: [
            // Vertical line at x=30 (accel midpoint)
            {
              label: '',
              type: 'line',
              data: [{ x: 30, y: 0 }, { x: 30, y: 60 }],
              borderColor: 'rgba(200, 200, 200, 0.8)',
              borderWidth: 2,
              fill: false,
              pointRadius: 0,
              showLine: true,
              hidden: true,
            },
            // Horizontal line at y=30 (braking midpoint)
            {
              label: '',
              type: 'line',
              data: [{ x: 0, y: 30 }, { x: 60, y: 30 }],
              borderColor: 'rgba(200, 200, 200, 0.8)',
              borderWidth: 2,
              fill: false,
              pointRadius: 0,
              showLine: true,
              hidden: true,
            },
            // User's tuning point
            {
              label: 'Your Tuning',
              type: 'scatter',
              data: [
                {
                  x: accelerationSensitivity,
                  y: brakingSensitivity,
                },
              ],
              pointRadius: 10,
              pointBackgroundColor: 'rgba(255, 215, 0, 1)',
              pointBorderColor: 'rgba(255, 255, 255, 1)',
              pointBorderWidth: 3,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'LSD Behavior Quadrants' },
            datalabels: {
              display: false,
            },
            annotation: {
              annotations: {
                topRight: {
                  type: 'label',
                  xValue: 45,
                  yValue: 45,
                  content: ['Locked &', 'Stable'],
                },
                bottomRight: {
                  type: 'label',
                  xValue: 45,
                  yValue: 15,
                  content: ['Oversteer', 'Prone'],
                },
                topLeft: {
                  type: 'label',
                  xValue: 15,
                  yValue: 45,
                  content: ['Understeer', 'Prone'],
                },
                bottomLeft: {
                  type: 'label',
                  xValue: 15,
                  yValue: 15,
                  content: ['Free', 'Diff'],
                },
              },
            },
          },
          scales: {
            x: {
              title: { display: true, text: 'Acceleration Sensitivity (0-60)' },
              min: 0,
              max: 60,
              ticks: { stepSize: 10 },
            },
            y: {
              title: { display: true, text: 'Braking Sensitivity (0-60)' },
              min: 0,
              max: 60,
              ticks: { stepSize: 10 },
            },
          },
        },
      };

      const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;

      // Send follow-up message via Discord webhook
      const webhookUrl = `https://discord.com/api/v10/webhooks/${env.DISCORD_APPLICATION_ID}/${token}`;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: 'LSD Behavior Analysis',
              description: `**${quadrantLabel}**\n${quadrantDescription}`,
              color: embedColor,
              fields: [
                { name: 'Initial Torque', value: `${initialTorque.toFixed(1)}`, inline: true },
                { name: 'Accel Sensitivity', value: `${accelerationSensitivity.toFixed(1)}`, inline: true },
                { name: 'Braking Sensitivity', value: `${brakingSensitivity.toFixed(1)}`, inline: true },
              ],
              image: { url: chartUrl },
              footer: { text: 'Gold dot = your tuning placement' },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error(`Webhook failed: ${response.status} ${response.statusText}`, await response.text());
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