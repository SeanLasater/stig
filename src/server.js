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
  InteractionResponseFlags,
  verifyKey,
} from 'discord-interactions';

import { 
  TUNEDOWNFORCE_COMMAND, 
  TUNECAMBERTHRUST_COMMAND,
  TUNETRANSMISSION_COMMAND, 
  TUNEDIFFERENTIAL_COMMAND,
  RACERESTRICTIONS_COMMAND,
  CONTACTSUPPORT_COMMAND,
  WRITEAREVIEW_COMMAND,
  FEATUREREQUEST_COMMAND,
} from './commands.js';

import { DAMAGE_CHOICES } from './damageData.js';
import { analyzeDifferentialTuning } from './diffData.js';
import { TRACK_CHOICES, TRANSMISSION_TUNINGS } from './transData.js';
import { TIRE_CHOICES } from './downforceData.js';
import { CARS } from './carData.js';
import { calculateCamberThrustToeOut, calculateGripTune } from './tuning.js';
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
    return {
      embeds: [
        {
          title: 'Invalid Input',
          description: result.error,
          color: 0xff0000,
        },
      ],
    };
  }

  return {
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
  };
}

function handleTuneCamberThrustCommand(interaction) {
  const { data } = interaction;
  const options = Object.fromEntries((data.options ?? []).map(opt => [opt.name, opt.value]));
  const tire = options.tire;
  const camber = options.camber;

  const result = calculateCamberThrustToeOut(tire, camber);

  if ('error' in result) {
    return {
      embeds: [
        {
          title: 'Invalid Input',
          description: result.error,
          color: 0xff0000,
        },
      ],
    };
  }

  return {
    embeds: [
      {
        title: 'Camber Thrust Compensation',
        color: 0x00b894,
        fields: [
          { name: 'Tire', value: result.tireDisplay, inline: false },
          { name: 'Camber', value: `${result.camber}°`, inline: true },
          { name: 'Optimal Toe-Out', value: `${result.toeOut}°`, inline: true },
        ],
        footer: { text: 'Toe-out recommendation helps offset camber thrust pull' },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

// ──────────────────────────────────────────────────────────────
// TUNE DIFFERENTIAL COMMAND HANDLER
// This function processes the /tune-differential command, analyzes the tuning characteristics, and returns a detailed embed with insights and sliding-scale metrics.
// ──────────────────────────────────────────────────────────────

function handleTuneDifferentialCommand(interaction) {
  const { data } = interaction;
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

  const isHighAccel = accelerationSensitivity > 30;
  const isHighBraking = brakingSensitivity > 30;
  let embedColor = 0xffd700;
  if (isHighAccel && isHighBraking) embedColor = 0xff6b00;
  else if (isHighAccel && !isHighBraking) embedColor = 0xff0000;
  else if (!isHighAccel && isHighBraking) embedColor = 0x0066ff;
  else embedColor = 0xffff00;

  function scaleToNum(val) {
    return Math.round(val * 20 - 10);
  }

  return {
    embeds: [
      {
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
      },
    ],
  };
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
    return {
      embeds: [{
        title: 'Invalid Track',
        description: `Track "${trackValue}" not found in transmission tuning database.`,
        color: 0xff0000,
      }],
    };
  }

  if (!carData) {
    return {
      embeds: [{
        title: 'Invalid Car',
        description: `Car "${carValue}" not found in car database.`,
        color: 0xff0000,
      }],
    };
  }

  // Find track name from TRACK_CHOICES
  const trackName = TRACK_CHOICES.find(t => t.value === trackValue)?.name || trackValue;

  // Build gear ratio fields
  const gearFields = Object.entries(trackData.gears).map(([gear, ratio]) => ({
    name: gear,
    value: `\`${ratio.toFixed(3)}\``,
    inline: true,
  }));

  return {
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
  };
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

  return {
    embeds: [{
      title: `Wednesday the ${ordinalDay} Restrictions :`,
      description: description,
      color: 0xff4500,
      timestamp: new Date().toISOString(),
    }],
  };
}

async function sendDirectMessage(interaction, env, messagePayload) {
  const token = env.DISCORD_TOKEN;
  const userId = interaction?.member?.user?.id || interaction?.user?.id;

  if (!token || !userId) {
    return false;
  }

  const dmChannelResponse = await fetch('https://discord.com/api/v10/users/@me/channels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    body: JSON.stringify({ recipient_id: userId }),
  });

  if (!dmChannelResponse.ok) {
    const errorText = await dmChannelResponse.text().catch(() => '<no body>');
    console.error(`Failed to open DM channel: ${dmChannelResponse.status} ${dmChannelResponse.statusText}`, errorText);
    return false;
  }

  const dmChannel = await dmChannelResponse.json();
  const dmMessageResponse = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    body: JSON.stringify(messagePayload),
  });

  if (!dmMessageResponse.ok) {
    const errorText = await dmMessageResponse.text().catch(() => '<no body>');
    console.error(`Failed to send DM: ${dmMessageResponse.status} ${dmMessageResponse.statusText}`, errorText);
    return false;
  }

  return true;
}

function getInteractionUsername(interaction) {
  return interaction?.member?.user?.global_name
    || interaction?.member?.user?.username
    || interaction?.user?.global_name
    || interaction?.user?.username
    || 'Unknown user';
}

function getOptionValue(interaction, optionName) {
  const options = interaction?.data?.options || [];
  const found = options.find(option => option.name === optionName);
  return found?.value;
}

function normalizeChannelId(value) {
  if (!value) return null;
  const normalized = String(value).replace(/[^0-9]/g, '');
  return normalized.length > 0 ? normalized : null;
}

async function findChannelIdByName(interaction, env, targetName) {
  const token = env.DISCORD_TOKEN;
  const guildId = interaction.guild_id;

  if (!token || !guildId) {
    return null;
  }

  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
    method: 'GET',
    headers: {
      Authorization: `Bot ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '<no body>');
    console.error(`Failed to fetch guild channels: ${response.status} ${response.statusText}`, errorText);
    return null;
  }

  const channels = await response.json();
  const targetChannel = channels.find(channel => channel?.name?.toLowerCase() === targetName.toLowerCase() && channel?.type === 0);
  return targetChannel?.id || null;
}

async function findAdminChannelId(interaction, env) {
  const configuredId = normalizeChannelId(env.DISCORD_ADMIN_CHANNEL_ID);
  if (configuredId) {
    return configuredId;
  }

  return findChannelIdByName(interaction, env, 'admin');
}

async function findSupportChannelId(interaction, env) {
  const configuredId = normalizeChannelId(env.DISCORD_SUPPORT_CHANNEL_ID);
  if (configuredId) {
    return configuredId;
  }

  return findChannelIdByName(interaction, env, 'support');
}

async function postMessageToChannel(channelId, token, message) {
  if (!channelId || !token) {
    return { ok: false, error: 'Missing channel id or token.' };
  }

  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    body: JSON.stringify({ content: message }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '<no body>');
    return {
      ok: false,
      error: `Failed to send message: ${response.status} ${response.statusText} ${errorText}`,
    };
  }

  return { ok: true };
}

async function sendAdminMessage(interaction, env, message) {
  const token = env.DISCORD_TOKEN;
  const configuredChannelId = normalizeChannelId(env.DISCORD_ADMIN_CHANNEL_ID);
  const channelId = configuredChannelId || await findAdminChannelId(interaction, env);

  if (!token || !channelId) {
    console.error('Missing bot token or #admin channel id; cannot send admin message.');
    return false;
  }

  const primarySend = await postMessageToChannel(channelId, token, message);
  if (primarySend.ok) {
    return true;
  }

  const fallbackChannelId = await findChannelIdByName(interaction, env, 'admin');
  if (!fallbackChannelId || fallbackChannelId === channelId) {
    console.error(`Failed to send admin message: ${primarySend.error}`);
    return false;
  }

  const fallbackSend = await postMessageToChannel(fallbackChannelId, token, message);
  if (!fallbackSend.ok) {
    console.error(`Failed to send admin message with configured and fallback channel ids: ${primarySend.error} | ${fallbackSend.error}`);
    return false;
  }

  return true;
}

async function deleteOriginalInteractionMessage(interaction, env) {
  const appId = env.DISCORD_APPLICATION_ID || interaction.application_id;
  const interactionToken = interaction.token;

  if (!appId || !interactionToken) {
    return;
  }

  const response = await fetch(`https://discord.com/api/v10/webhooks/${appId}/${interactionToken}/messages/@original`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text().catch(() => '<no body>');
    console.error(`Failed to delete original interaction message: ${response.status} ${response.statusText}`, errorText);
  }
}

function buildSupportForwardMessage(interaction, commandName, messageBody, requestKind) {
  const username = getInteractionUsername(interaction);
  const userId = interaction?.member?.user?.id || interaction?.user?.id || 'unknown-user-id';
  const sanitizedMessage = String(messageBody || '').trim();

  return [
    `📨 ${requestKind}`,
    `User: ${username} (${userId})`,
    `Command: /${commandName}`,
    'Message:',
    sanitizedMessage,
  ].join('\n');
}

async function processSupportIntake(interaction, env, commandName, requestKind) {
  const username = getInteractionUsername(interaction);
  const supportChannelId = await findSupportChannelId(interaction, env);
  const invokedChannelId = interaction?.channel_id;

  if (!supportChannelId || !invokedChannelId || supportChannelId !== invokedChannelId) {
    await sendDirectMessage(interaction, env, {
      content: 'Please use this command in #support so your message gets routed correctly.',
    });
    await sendAdminMessage(interaction, env, `⚠️ ${username} tried /${commandName} outside #support.`);
    return;
  }

  const messageBody = getOptionValue(interaction, 'message');
  const adminMessage = buildSupportForwardMessage(interaction, commandName, messageBody, requestKind);
  const sentToAdmin = await sendAdminMessage(interaction, env, adminMessage);

  if (sentToAdmin) {
    const confirmation = [
      `Thanks for the ${requestKind.toLowerCase()}!`,
      'Your message was sent to #admin.',
      'We are a one-man operation working hard to deliver great functionality at the lowest price possible, and we truly appreciate your support.',
    ].join(' ');
    const dmSent = await sendDirectMessage(interaction, env, { content: confirmation });
    if (!dmSent) {
      await sendAdminMessage(interaction, env, `⚠️ Failed to send confirmation DM to ${username} for /${commandName}.`);
    }
    return;
  }

  await sendDirectMessage(interaction, env, {
    content: 'Thanks for reaching out. I could not forward your message to #admin right now, please try again shortly.',
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

  if (focusedOption.name === 'track') {
    const focusedValue = focusedOption.value.toLowerCase();
    const filtered = TRACK_CHOICES
      .filter(track => track.name.toLowerCase().includes(focusedValue))
      .slice(0, 25);

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

  if (focusedOption.name === 'car') {
    const focusedValue = focusedOption.value.toLowerCase();
    const filtered = CARS
      .filter(car => car.name.toLowerCase().includes(focusedValue))
      .slice(0, 25);

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

  return new JsonResponse({
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: { choices: [] },
  });
}

// ──────────────────────────────────────────────────────────────
// ROUTER AND SERVER SETUP
// ──────────────────────────────────────────────────────────────

const router = AutoRouter();

router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

router.post('/', async (request, env, ctx) => {
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env,
  );

  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }

  if (interaction.type === InteractionType.PING) {
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
    return handleAutocomplete(interaction);
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    let messagePayload;
    let supportIntakeCommand = null;

    switch (interaction.data.name.toLowerCase()) {
      case TUNEDOWNFORCE_COMMAND.name.toLowerCase(): {
        messagePayload = handleTuneDownforceCommand(interaction);
        break;
      }

      case TUNECAMBERTHRUST_COMMAND.name.toLowerCase(): {
        messagePayload = handleTuneCamberThrustCommand(interaction);
        break;
      }

      case TUNETRANSMISSION_COMMAND.name.toLowerCase(): {
        messagePayload = handleTuneTransmissionCommand(interaction);
        break;
      }

      case TUNEDIFFERENTIAL_COMMAND.name.toLowerCase(): {
        messagePayload = handleTuneDifferentialCommand(interaction);
        break;
      }

      case RACERESTRICTIONS_COMMAND.name.toLowerCase(): {
        messagePayload = handleRaceRestrictionsCommand(interaction);
        break;
      }

      case CONTACTSUPPORT_COMMAND.name.toLowerCase(): {
        supportIntakeCommand = {
          commandName: CONTACTSUPPORT_COMMAND.name,
          requestKind: 'Support Request',
        };
        break;
      }

      case WRITEAREVIEW_COMMAND.name.toLowerCase(): {
        supportIntakeCommand = {
          commandName: WRITEAREVIEW_COMMAND.name,
          requestKind: 'Review',
        };
        break;
      }

      case FEATUREREQUEST_COMMAND.name.toLowerCase(): {
        supportIntakeCommand = {
          commandName: FEATUREREQUEST_COMMAND.name,
          requestKind: 'Feature Request',
        };
        break;
      }

      default:
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }

    const sendPromise = (async () => {
      if (supportIntakeCommand) {
        await processSupportIntake(
          interaction,
          env,
          supportIntakeCommand.commandName,
          supportIntakeCommand.requestKind,
        );
        await deleteOriginalInteractionMessage(interaction, env);
        return;
      }

      const sent = await sendDirectMessage(interaction, env, messagePayload).catch((error) => {
        console.error('Error sending direct message:', error);
        return false;
      });

      const username = getInteractionUsername(interaction);
      const slashCommandName = interaction?.data?.name || 'unknown-command';

      await sendAdminMessage(interaction, env, `${username} ran /${slashCommandName}`);

      if (!sent) {
        await sendAdminMessage(
          interaction,
          env,
          `⚠️ Failed to DM ${username} for /${slashCommandName}.`,
        );
      }

      await deleteOriginalInteractionMessage(interaction, env);
    })();

    if (ctx?.waitUntil) {
      ctx.waitUntil(sendPromise);
    }

    return new JsonResponse({
      type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    });
  }

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