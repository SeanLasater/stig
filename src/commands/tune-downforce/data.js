// data.js
export const gripDict = {
  ch: 0.82, cm: 0.90, cs: 0.99,
  sh: 1.05, sm: 1.09, ss: 1.16,
  rh: 1.25, rm: 1.29, rs: 1.33,
};

export const tireNames = {
  CH: 'Comfort Hard',   CM: 'Comfort Medium', CS: 'Comfort Soft',
  SH: 'Sports Hard',    SM: 'Sports Medium',  SS: 'Sports Soft',
  RH: 'Racing Hard',    RM: 'Racing Medium',  RS: 'Racing Soft',
};

export const command = {
  name: 'tune-downforce',
  description: 'GT7 grip-optimized downforce & natural frequency',
  options: [
    {
      name: 'weight',
      description: 'Car weight in pounds (lbs)',
      type: 10, // number
      required: true,
      min_value: 1000,
      max_value: 5000,
    },
    {
      name: 'front',
      description: 'Front weight distribution % (e.g. 54)',
      type: 10, // number
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
  ],
};