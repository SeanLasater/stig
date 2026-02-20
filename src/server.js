/**
CHANGE FOR MY APP!
 */

import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';

// Utility class that wraps JSON responses with proper headers for Discord API communication
class JsonResponse extends Response {
  constructor(body, init) {
    // Convert body object to JSON string for transmission
    const jsonBody = JSON.stringify(body);
    // Set default headers if none provided; ensures JSON content-type is declared
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
// Maps tire compounds to grip coefficients; used to calculate vehicle downforce and natural frequency
// Lower values (comfort tires) = less grip; Higher values (racing tires) = more grip
const gripDict = {
  ch: 0.82, cm: 0.90, cs: 0.99,  // Comfort: Hard, Medium, Soft
  sh: 1.05, sm: 1.09, ss: 1.16,  // Sports: Hard, Medium, Soft
  rh: 1.25, rm: 1.29, rs: 1.33,  // Racing: Hard, Medium, Soft
};

// Human-readable tire names used in Discord embed output; maps uppercase keys to full display names
const tireNames = {
  CH: 'Comfort Hard', CM: 'Comfort Medium', CS: 'Comfort Soft',
  SH: 'Sports Hard', SM: 'Sports Medium', SS: 'Sports Soft',
  RH: 'Racing Hard', RM: 'Racing Medium', RS: 'Racing Soft',
};

// Core physics calculation function: computes downforce and natural frequency based on vehicle parameters
function calculateGripTune(weightLbs, frontPercent, tire) {
  // Normalize tire input to lowercase for lookup in gripDict
  const tireKey = tire.toLowerCase();
  // Retrieve grip multiplier for the tire (default to 1.0 if not found)
  const grip = gripDict[tireKey] ?? 1.0;

  // Validate front weight distribution is within safe tuning range (30-70% front)
  if (frontPercent < 30 || frontPercent > 70) {
    return { error: 'Front weight % must be between 30 and 70.' };
  }

  // Calculate weight distribution ratios from front percentage
  const frontRatio = frontPercent / 100;
  const rearRatio = 1 - frontRatio;

  // Distribute total weight between front and rear axles
  const frontWeight = weightLbs * frontRatio;
  const rearWeight = weightLbs * rearRatio;

  // Calculate natural frequencies (Hz) for suspension tuning; affects car handling responsiveness
  // baseNF is grip-adjusted; front slightly higher (1.06x) for stability, rear slightly lower (0.94x) for control
  const baseNF = grip * 2.0;
  const frontNF = Math.max(1.40, Math.min(3.30, baseNF * 1.06));  // Constrain to 1.40-3.30 Hz range
  const rearNF = Math.max(1.40, Math.min(3.30, baseNF * 0.94));   // Constrain to 1.40-3.30 Hz range

  // Calculate downforce (in lbs) for each axle; grip multiplier scales downforce with tire compound
  const dfPerLb = 0.11;  // 0.11 lbs of downforce per lb of car weight
  const frontDF = Math.max(0, Math.min(300, frontWeight * grip * dfPerLb));  // Constrain to 0-300 lbs
  const rearDF = Math.max(0, Math.min(300, rearWeight * grip * dfPerLb));    // Constrain to 0-300 lbs

  // Return calculation results formatted for display; all numeric values rounded appropriately
  return {
    frontDF:  frontDF.toFixed(1),                              // Downforce rounded to 1 decimal place
    rearDF:   rearDF.toFixed(1),                               // Downforce rounded to 1 decimal place
    frontNF:  frontNF.toFixed(2),                              // Natural frequency rounded to 2 decimals
    rearNF:   rearNF.toFixed(2),                               // Natural frequency rounded to 2 decimals
    grip:     grip.toFixed(2),                                 // Grip coefficient rounded to 2 decimals
    tireDisplay: tireNames[tire.toUpperCase()] || tire.toUpperCase(),  // Human-readable tire name
  };
}

// Discord slash command definition for tune-downforce; defines command name, description, and input options
const TUNEDOWNFORCE_COMMAND = {
  name: 'tune-downforce',  // Command invoked as /tune-downforce
  description: 'GT7 grip-optimized downforce & natural frequency',  // Help text shown in Discord
  // Define three required input options for the command
  options: [
    {
      name: 'weight',                                 // Parameter name users will see
      description: 'Car weight in pounds (lbs)',      // Help text for this parameter
      type: 10,                                        // Type 10 = number
      required: true,                                  // User must provide this value
      min_value: 1000,                                 // Minimum weight constraint
      max_value: 5000,                                 // Maximum weight constraint
    },
    {
      name: 'front',                                   // Parameter name for weight distribution
      description: 'Front weight distribution % (e.g. 54)',
      type: 10,                                        // Type 10 = number
      required: true,
      min_value: 30,                                   // Minimum front% for valid tuning
      max_value: 70,                                   // Maximum front% for valid tuning
    },
    {
      name: 'tire',                                    // Parameter name for tire selection
      description: 'Tire compound',
      type: 3,                                         // Type 3 = string with predefined choices
      required: true,
      choices: [  // User selects from this dropdown list

        { name: 'Comfort Hard', value: 'ch' }, { name: 'Comfort Medium', value: 'cm' }, { name: 'Comfort Soft', value: 'cs' },
        { name: 'Sports Hard', value: 'sh' }, { name: 'Sports Medium', value: 'sm' }, { name: 'Sports Soft', value: 'ss' },
        { name: 'Racing Hard', value: 'rh' }, { name: 'Racing Medium', value: 'rm' }, { name: 'Racing Soft', value: 'rs' },
      ],
    },
  ],
};

// Discord slash command definition for tune-transmission; placeholder for future transmission tuning feature
const TUNETRANSMISSION_COMMAND = {
  name: 'tune-transmission',                   // Command name as typed by user
  description: 'Tune transmission based on track and car.',  // Description shown to user
};

// Helper function to construct Discord embed object with consistent formatting for command responses
function createFollowUpBody(title, fields = [], color = 0xffd700) {
  // Build embed object with title, color, fields, footer, and timestamp
  const embed = {
    title,                                                      // Main title of the embed
    color,                                                      // Embed color (0xffd700 = gold)
    fields,                                                     // Array of embed fields (name/value pairs)
    footer: { text: 'Pure grip focus • No speed trade-off • Values in lbs' },  // Footer text
    timestamp: new Date().toISOString(),                        // Current timestamp
  };

  // Discord embeds must be wrapped in { embeds: [...] }
  return { embeds: [embed] };
}

// Handler function that processes /tune-downforce command from Discord user
function handleTuneDownforceCommand(interaction) {
  // Extract command data from Discord interaction payload
  const { data } = interaction;
  // Convert Discord options array into key-value object for easy access (e.g., { weight: 2000, front: 54, tire: 'ch' })
  const options = Object.fromEntries((data.options ?? []).map(opt => [opt.name, opt.value]));
  // Extract specific parameters provided by user
  const weight = options.weight;  // Car weight in lbs
  const front  = options.front;   // Front weight distribution percentage
  const tire   = options.tire;    // Tire compound code (e.g., 'ch', 'rh')

  // Perform the core physics calculation with user inputs
  const result = calculateGripTune(weight, front, tire);

  // Check if calculation returned an error (e.g., invalid weight distribution)
  if ('error' in result) {
    // Return error response with red embed (0xff0000 = red)
    return new JsonResponse({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,  // Send visible message in channel
      data: {
        embeds: [
          {
            title: 'Invalid Input',              // Error title
            description: result.error,           // Error message from calculation
            color: 0xff0000,                     // Red color for error indication
          },
        ],
      },
    });
  }

  // Return successful calculation results formatted as Discord embed
  return new JsonResponse({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,  // Send visible message in channel
    data: {
      embeds: [
        {
          title: 'GT7 Grip-Optimized Tuning',  // Response title
          color: 0xffd700,                      // Gold color for success
          fields: [                             // Display input parameters and calculated results
            { name: 'Weight', value: `${weight.toLocaleString()} lbs`, inline: false },              // Show user's weight input
            { name: 'Balance', value: `${front}% Front │ ${100 - front}% Rear`, inline: false },    // Show weight distribution
            { name: 'Tire', value: `${result.tireDisplay} (Grip: ${result.grip}g)`, inline: false }, // Show selected tire and grip value
            { name: '**FRONT**', value: `\`\`\`Downforce: ${result.frontDF.padStart(6)}\nNat Freq : ${result.frontNF} Hz\`\`\``, inline: true },   // Front downforce & frequency
            { name: '**REAR**', value: `\`\`\`Downforce: ${result.rearDF.padStart(6)}\nNat Freq : ${result.rearNF} Hz\`\`\``, inline: true },     // Rear downforce & frequency
          ],
          footer: { text: 'Pure grip focus • No speed trade-off • Values in lbs' },  // Footer reminder
          timestamp: new Date().toISOString(),  // Timestamp for audit trail
        },
      ],
    },
  });
}

// Create router to handle HTTP requests; directs GET/POST to appropriate handlers
const router = AutoRouter();

// GET / route — health check endpoint; returns Discord Application ID to confirm worker is running
router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

// POST / route — main handler for all Discord interactions (ping, slash commands, etc.)
router.post('/', async (request, env) => {
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

  // Handle APPLICATION_COMMAND interaction (user typed a slash command)
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // Route command to appropriate handler based on command name
    switch (interaction.data.name.toLowerCase()) {
      case TUNEDOWNFORCE_COMMAND.name.toLowerCase(): {
        // User invoked /tune-downforce
        return handleTuneDownforceCommand(interaction);
      }

      case TUNETRANSMISSION_COMMAND.name.toLowerCase(): {
        // User invoked /tune-transmission (not yet implemented)
        return new Response(`Transmission tuning coming soon!`);
      }
      default:
        // Unknown command name
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