// Discord slash command definitions.
// Example: 'tune-downforce' (not 'Tune-Downforce')


// tune-downforce
export const TUNEDOWNFORCE_COMMAND = {
  name: 'Tune-Downforce',  // Name shown in Discord command picker (should be kebab-case: tune-downforce)
  description: 'Tune for optimal downforce based on weight, balance, and tire.',  // Help text
  options: [
    {
      name: 'weight',                                 
      description: 'Car weight in pounds (lbs)',      
      type: 10, // num 
      required: true,                                  
      min_value: 1000,                                 // Minimum weight (lbs)
      max_value: 5000,                                 // Maximum weight (lbs)
    },
    {
      name: 'front',                               
      description: 'Front weight distribution % (e.g. 54)',  
      type: 10, // num 
      required: true,
      min_value: 30,                                   // Minimum safe front weight %
      max_value: 70,                                   // Maximum safe front weight %
    },
    {
      name: 'tire',                                
      description: 'Tire compound',                   
      type: 3, // string
      required: true,
      choices: [
        // Dropdown options for tire selection
        // Format: { name: 'Display name', value: 'code used in calculation' }
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


// tune-transmission
export const TUNETRANSMISSION_COMMAND = {
  name: 'Tune-Transmission',                          
  description: 'Tune transmission based on track and car.',  
  // No options defined yet; to be implemented in future version
};