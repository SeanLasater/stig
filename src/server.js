/**
CHANGE FOR MY APP!
 */

import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

// ──────────────────────────────────────────────────────────────
// Embedded tune-downforce data & logic
// ──────────────────────────────────────────────────────────────
const gripDict = {
  ch: 0.82, cm: 0.90, cs: 0.99,
  sh: 1.05, sm: 1.09, ss: 1.16,
  rh: 1.25, rm: 1.29, rs: 1.33,
};

const tireNames = {
  CH: 'Comfort Hard', CM: 'Comfort Medium', CS: 'Comfort Soft',
  SH: 'Sports Hard', SM: 'Sports Medium', SS: 'Sports Soft',
  RH: 'Racing Hard', RM: 'Racing Medium', RS: 'Racing Soft',
};

function calculateGripTune(weightLbs, frontPercent, tire) {
  const tireKey = tire.toLowerCase();
  const grip = gripDict[tireKey] ?? 1.0;

  if (frontPercent < 30 || frontPercent > 70) {
    return { error: 'Front weight % must be between 30 and 70.' };
  }

  const frontRatio = frontPercent / 100;
  const rearRatio = 1 - frontRatio;

  const frontWeight = weightLbs * frontRatio;
  const rearWeight = weightLbs * rearRatio;

  const baseNF = grip * 2.0;
  const frontNF = Math.max(1.40, Math.min(3.30, baseNF * 1.06));
  const rearNF = Math.max(1.40, Math.min(3.30, baseNF * 0.94));

  const dfPerLb = 0.11;
  const frontDF = Math.max(0, Math.min(300, frontWeight * grip * dfPerLb));
  const rearDF = Math.max(0, Math.min(300, rearWeight * grip * dfPerLb));

  return {
    frontDF:  frontDF.toFixed(1),
    rearDF:   rearDF.toFixed(1),
    frontNF:  frontNF.toFixed(2),
    rearNF:   rearNF.toFixed(2),
    grip:     grip.toFixed(2),
    tireDisplay: tireNames[tire.toUpperCase()] || tire.toUpperCase(),
  };
}

const TUNEDOWNFORCE_COMMAND = {
  name: 'tune-downforce',
  description: 'GT7 grip-optimized downforce & natural frequency',
  options: [
    {
      name: 'weight',
      description: 'Car weight in pounds (lbs)',
      type: 10,
      required: true,
      min_value: 1000,
      max_value: 5000,
    },
    {
      name: 'front',
      description: 'Front weight distribution % (e.g. 54)',
      type: 10,
      required: true,
      min_value: 30,
      max_value: 70,
    },
    {
      name: 'tire',
      description: 'Tire compound',
      type: 3,
      required: true,
      choices: [
        { name: 'Comfort Hard', value: 'ch' }, { name: 'Comfort Medium', value: 'cm' }, { name: 'Comfort Soft', value: 'cs' },
        { name: 'Sports Hard', value: 'sh' }, { name: 'Sports Medium', value: 'sm' }, { name: 'Sports Soft', value: 'ss' },
        { name: 'Racing Hard', value: 'rh' }, { name: 'Racing Medium', value: 'rm' }, { name: 'Racing Soft', value: 'rs' },
      ],
    },
  ],
};

const TUNETRANSMISSION_COMMAND = {
  name: 'tune-transmission',
  description: 'Tune transmission based on track and car.',
};

function createFollowUpBody(title, fields = [], color = 0xffd700) {
  const embed = {
    title,
    color,
    fields,
    footer: { text: 'Pure grip focus • No speed trade-off • Values in lbs' },
    timestamp: new Date().toISOString(),
  };

  return { embeds: [embed] };
}

function handleTuneDownforceCommand(interaction) {
  const { data } = interaction;
  const options = Object.fromEntries((data.options ?? []).map(opt => [opt.name, opt.value]));
  const weight = options.weight;
  const front  = options.front;
  const tire   = options.tire;

  const result = calculateGripTune(weight, front, tire);

  let content = '';
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

const router = AutoRouter();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Main route for all requests sent from Discord.  All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post('/', async (request, env) => {
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env,
  );
  if (!isValid || !interaction) {
    return new Response('Bad request signature.', { status: 401 });
  }

  if (interaction.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Most user commands will come as `APPLICATION_COMMAND`.
    switch (interaction.data.name.toLowerCase()) {
      case TUNEDOWNFORCE_COMMAND.name.toLowerCase(): {
        return handleTuneDownforceCommand(interaction);
      }

      case TUNETRANSMISSION_COMMAND.name.toLowerCase(): {
        return new Response(`Transmission tuning coming soon! In the meantime, invite the bot to your server and try out the downforce tuning command:\n\n${INVITE_URL}`);
      }
      default:
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
  }

  console.error('Unknown Type');
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});
router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  return { interaction: JSON.parse(body), isValid: true };
}

const server = {
  verifyDiscordRequest,
  fetch: router.fetch,
};

export default server;