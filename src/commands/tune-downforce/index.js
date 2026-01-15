import { calculateGripTune } from './data.js';

// Command metadata for registration (Discord expects this exact shape)
export const data = {
  name: 'tune-downforce',
  description: 'GT7 grip-optimized downforce & natural frequency',
  options: [
    {
      name: 'weight',
      description: 'Car weight in pounds (lbs)',
      type: 10,  // NUMBER
      required: true,
      min_value: 1000,
      max_value: 5000,
    },
    {
      name: 'front',
      description: 'Front weight distribution % (e.g. 54)',
      type: 10,  // NUMBER
      required: true,
      min_value: 30,
      max_value: 70,
    },
    {
      name: 'tire',
      description: 'Tire compound',
      type: 3,   // STRING
      required: true,
      choices: [
        { name: 'Comfort Hard',   value: 'ch' },
        { name: 'Comfort Medium', value: 'cm' },
        { name: 'Comfort Soft',   value: 'cs' },
        { name: 'Sports Hard',    value: 'sh' },
        { name: 'Sports Medium',  value: 'sm' },
        { name: 'Sports Soft',    value: 'ss' },
        { name: 'Racing Hard',    value: 'rh' },
        { name: 'Racing Medium',  value: 'rm' },
        { name: 'Racing Soft',    value: 'rs' },
      ],
    },
  ],
};

// Handler: receives raw interaction, returns response object
export async function execute(interaction) {
  const opts = interaction.data.options || [];
  const weight = opts.find(o => o.name === 'weight')?.value;
  const front = opts.find(o => o.name === 'front')?.value;
  const tire = opts.find(o => o.name === 'tire')?.value;

  if (typeof weight !== 'number' || typeof front !== 'number' || typeof tire !== 'string') {
    return { type: 4, data: { content: 'Invalid input values.' } };
  }

  const result = calculateGripTune(weight, front, tire);

  if ('error' in result) {
    return {
      type: 4,
      data: {
        embeds: [{
          title: 'Invalid Input',
          description: result.error,
          color: 0xff0000,
        }],
      },
    };
  }

  const embed = {
    title: 'GT7 Grip-Optimized Tuning',
    color: 0xffd700, // gold
    fields: [
      { name: 'Weight', value: `${weight.toLocaleString()} lbs`, inline: false },
      { name: 'Balance', value: `${front}% Front │ ${100 - front}% Rear`, inline: false },
      { name: 'Tire', value: `${result.tireDisplay} (Grip: ${result.grip}g)`, inline: false },
      {
        name: '**FRONT**',
        value: `\`\`\`Downforce: ${result.frontDF.padStart(6)}\nNat Freq : ${result.frontNF} Hz\`\`\``,
        inline: true,
      },
      {
        name: '**REAR**',
        value: `\`\`\`Downforce: ${result.rearDF.padStart(6)}\nNat Freq : ${result.rearNF} Hz\`\`\``,
        inline: true,
      },
    ],
    footer: { text: 'Pure grip focus • No speed trade-off • Values in lbs' },
    timestamp: new Date().toISOString(),
  };

  return {
    type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
    data: { embeds: [embed] },
  };
}