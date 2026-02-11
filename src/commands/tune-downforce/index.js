// Example
export const data = {
  name: 'tune-downforce',
  description: 'Adjust downforce settings for better cornering',
  options: [
    {
      name: 'level',
      description: 'Downforce level (1-10)',
      type: 4,  // Integer
      required: true,
      min_value: 1,
      max_value: 10,
    },
    {
      name: 'mode',
      description: 'Tuning mode',
      type: 3,  // String
      required: false,
      choices: [
        { name: 'Aggressive', value: 'aggro' },
        { name: 'Balanced', value: 'balanced' },
        { name: 'Safe', value: 'safe' },
      ],
    },
  ],
};

// Execution logic — this runs when user invokes /tune-downforce
export async function execute(interaction) {
  const level = interaction.data.options?.find(opt => opt.name === 'level')?.value;
  const mode = interaction.data.options?.find(opt => opt.name === 'mode')?.value ?? 'balanced';

  // Your custom logic here (e.g., calculate something, call an API, etc.)
  const result = `Downforce tuned to level ${level} in ${mode} mode!`;
  // Could be complex: simulate lap time improvement, generate embed, etc.

  return {
    type: 4,  // ChannelMessageWithSource
    data: {
      content: result,
      // embeds: [{ title: 'Tuning Complete', description: ..., color: 0x00ff00 }],
      // flags: 64, // ephemeral if you want private reply
    },
  };
}