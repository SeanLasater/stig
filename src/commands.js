export const TUNEDOWNFORCE_COMMAND = {
  name: 'Tune-Downforce',
  description: 'Tune for optimal downforce based on weight, balance, and tire.',
  options: [
    {
      name: 'weight',
      description: 'Car weight in pounds (lbs)',
      type: 10, // num
      required: true,
      min_value: 1000,
      max_value: 5000,
    },
    {
      name: 'front',
      description: 'Front weight distribution % (e.g. 54)',
      type: 10, // num
      required: true,
      min_value: 30,
      max_value: 70,
    },
    {
      name: 'tire',
      description: 'Tire compound',
      type: 3, // string
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
  ]
};

export const TUNETRANSMISSION_COMMAND = {
  name: 'Tune-Transmission',
  description: 'Tune transmission based on track and car.',
};