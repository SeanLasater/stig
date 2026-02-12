import { calculateGripTune } from './logic.js';

// Helper to create deferred response (type 5) for main calculation logic.
function deferReply() {
  return new Response(
    JSON.stringify({ type: 5 }), // Defer Channel Message
    { headers: { 'Content-Type': 'application/json' } }
  );
}

// Create follow-up response (simple text + optional time embed)
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

// Your helpers (deferReply & createFollowUpBody) stay the same

export async function handleTuneDownforce(interaction, env) {
  // Extract options (this was missing in your new version!)
  const { data } = interaction;
  const options = Object.fromEntries(
    (data.options ?? []).map(opt => [opt.name, opt.value])
  );
  const weight = options.weight;
  const front  = options.front;
  const tire   = options.tire;

  // Run calculation
  const result = calculateGripTune(weight, front, tire);

  let responseBody;
  if ('error' in result) {
    responseBody = createFollowUpBody(
      'Invalid Input',
      [{ name: 'Error', value: result.error }],
      0xff0000,
      true
    );
  } else {
    const balance = `${front}% Front │ ${100 - front}% Rear`;
    responseBody = createFollowUpBody('GT7 Grip-Optimized Tuning', [
      { name: 'Weight', value: `${weight.toLocaleString()} lbs`, inline: false },
      { name: 'Balance', value: balance, inline: false },
      { name: 'Tire', value: `${result.tireDisplay} (Grip: ${result.grip}g)`, inline: false },
      {
        name: '**FRONT**',
        value: 'Downforce',
        inline: true,
      },
      {
        name: 'REAR',
        value: 'Downforce: ' + result.rearDF.padStart(6) + '\nNat Freq : ' + result.rearNF + ' Hz',
        inline: true,
      },
    ]);
  }

  // Edit the original deferred message
  const applicationId = interaction.application_id;
  const token = interaction.token;
  const editUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${token}/messages/@original`;

  await fetch(editUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseBody),
  });

  // No return needed — this is background work
}


/*
export async function handleTuneDownforce(interaction, env) {
  // Extract options for weight, front, tire.
  const { data } = interaction;
  const options = Object.fromEntries(
    (data.options ?? []).map(opt => [opt.name, opt.value])
  );

  const weight = options.weight;
  const front  = options.front;
  const tire   = options.tire;

  // Extract slash command args (weight, balance, tire)
  const deferResponse = deferReply();
  const result = calculateGripTune(weight, front, tire);

  // Tuning calculations. (Sync call)
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

  // 2. Build embed/message (Error or Tuning result)
  const token = interaction.token;
  const applicationId = interaction.application_id;
  const editUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${token}/messages/@original`;

  await fetch(editUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseBody),
  });
}

*/