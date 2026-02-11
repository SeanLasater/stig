

import { calculateDownforce } from "./logic.js";

const commandHandlers = {
  'tune-downforce': tuneDownforceExecute,
  // Add more: 'other-command': otherExecute,
};

export const data = {
  name: 'tune-downforce',
  description: 'Tune downforce based on weight, tire and balance',
  options: [
    {
      name: 'tire',
      description: 'Your tire compound.',
      type: 3, // string
      required: true,
      choices: [
        { name: 'ch', value: 'comfort-hard' },
        { name: 'cm', value: 'comfort-medium' },
        { name: 'cs', value: 'comfort-soft' },
        { name: 'sh', value: 'sport-hard' },
        { name: 'sm', value: 'sport-medium' },
        { name: 'ss', value: 'sport-soft' },
        { name: 'rh', value: 'racing-hard' },
        { name: 'rm', value: 'racing-medium' },
        { name: 'rs', value: 'racing-soft' },
      ]
    },
    {
      name: 'weight',
      description: 'Your choice of tire compound.',
      type: 4, // int
      required: true,
    },
    {
      name: 'balance',
      description: 'Your vehicles weight balance.',
      type: 4, // int
      required: true,
    },
  ],
}


// PLACEHOLDER     !REPLACE!
export async function execute(interaction) {
  // Pull values from Discord command
  const tire = interaction.data.options.find(o => o.name === 'tire-compound').value ?? 'comfort-hard'
  const weight = interaction.data.options.find(o => o.name === 'vehicle_weight')?.value;
  const balance = interaction.data.options.find(o => o.name === 'vehicle_balance')?.value;

  const result = calculateDownforce(tire, weight, balance);

  return {
    type: 4, // ChannelMessageWithSource
    data: {
      embeds: [{
        title: '✅ GT7 Downforce Tune',
        description: `${tire} tire • ${weight} weight • ${balance} balance`,
        fields: [
          { name: 'Front Downforce', value: `${result.recommended.front} lbs`, inline: true },
          { name: 'Rear Downforce', value: `${result.recommended.rear} lbs`, inline: true },
          { name: 'Balance', value: result.recommended.balance, inline: true },
          { name: 'Top Speed Loss', value: `-${result.topSpeedLoss} km/h`, inline: true },
          { name: 'Cornering Gain', value: `+${result.corneringGainEstimate}%`, inline: true },
        ],
        color: 0x00ff00, // green
        footer: { text: 'Adjust in-game sliders to match these values' },
      }],
    },
  };
}