// Discord slash command definitions.
// Example: 'tune-downforce' (not 'Tune-Downforce')
import { TIRE_CHOICES } from './downforceData.js';
import { TRACK_CHOICES, CAR_CHOICES } from './transData.js';

// tune-downforce
export const TUNEDOWNFORCE_COMMAND = {
  name: 'tune-downforce',
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
      choices: TIRE_CHOICES,
    },
  ]
};


// tune-transmission
export const TUNETRANSMISSION_COMMAND = {
  name: 'tune-transmission',                  
  description: 'Tune transmission based on track and car.',
  options: [  
    {
      name: 'track',                                 
      description: 'Track name (e.g. "Monza")',
      type: 3, // string
      required: true,
      choices: TRACK_CHOICES,
    },
    {
      name: 'car',                                   
      description: 'Car name (e.g. "Porsche 911 GT3 RS")',
      type: 3, // string
      choices: CAR_CHOICES,
    },
  ],
};

// tune-differential
export const TUNEDIFFERENTIAL_COMMAND = {
  name: 'tune-differential',
  description: 'Plot LSD behavior quadrants for RWD tuning.',
  options: [
    {
      name: 'initial_torque',
      description: 'Initial torque value (0-60 scale)',
      type: 10,
      required: true,
      min_value: 0,
      max_value: 60,
    },
    {
      name: 'acceleration_sensitivity',
      description: 'Acceleration sensitivity value (0-60 scale)',
      type: 10,
      required: true,
      min_value: 0,
      max_value: 60,
    },
    {
      name: 'braking_sensitivity',
      description: 'Braking sensitivity value (0-60 scale)',
      type: 10,
      required: true,
      min_value: 0,
      max_value: 60,
    }
  ],
};