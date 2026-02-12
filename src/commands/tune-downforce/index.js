// index.js  (or commands/tune-downforce.js)
import { calculateGripTune } from './logic.js';

// Helper to create deferred response (type 5)
function deferReply() {
  return new Response(
    JSON.stringify({ type: 5 }), // Defer Channel Message
    { headers: { 'Content-Type': 'application/json' } }
  );
}

// Helper to create follow-up patch body (simple text + optional embed)
function createFollowUpBody(title, fields = [], color = 0xffd700, error = false) {
  const embed = {
    title,
    color,
    fields,
    footer: { text: 'Pure grip focus • No speed trade-off • Values in lbs' },
    timestamp: new Date().toISOString(),
  };

  return {
    embeds: [embed],
  };
}

export async function handleTuneDownforce(interaction, env) {
  const { data } = interaction;
  const options = Object.fromEntries(
    (data.options ?? []).map(opt => [opt.name, opt.value])
  );

  const weight = options.weight;
  const front  = options.front;
  const tire   = options.tire;

  // 1. Immediately defer
  const deferResponse = deferReply();
  
  // Run calculation (can be async if needed later)
  const result = calculateGripTune(weight, front, tire);

  let responseBody;

  if ('error' in result) {
    responseBody = createFollowUpBody(
      'Invalid Input',
      [{ name: 'Error', value: result.error }],
      0xff0000, // red
      true
    );
  } else {
    const balance = `${front}% Front │ ${100 - front}% Rear`;

    responseBody = createFollowUpBody('GT7 Grip-Optimized Tuning', [
      { name: 'Weight',   value: `${weight.toLocaleString()} lbs`, inline: false },
      { name: 'Balance',  value: balance, inline: false },
      { name: 'Tire',     value: `${result.tireDisplay} (Grip: ${result.grip}g)`, inline: false },
      {
        name: '**FRONT**',
        value: '```Downforce: ' + result.frontDF.padStart(6) + '\nNat Freq : ' + result.frontNF + ' Hz```',
        inline: true,
      },
      {
        name: '**REAR**',
        value: '```Downforce: ' + result.rearDF.padStart(6) + '\nNat Freq : ' + result.rearNF + ' Hz```',
        inline: true,
      },
    ]);
  }

  // 2. Edit the deferred message via webhook
  const token = interaction.token;
  const applicationId = interaction.application_id;
  const editUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${token}/messages/@original`;

  await fetch(editUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseBody),
  });

  // We already returned the defer response
  return deferResponse;
}

// If you're using a router (e.g. itty-router), you would map:
// router.post('/', async (req, env) => { ... parse body → if name === 'tune-downforce' → handleTuneDownforce(body, env) })