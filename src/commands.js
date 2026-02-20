// Discord slash command definitions
// These definitions are exported and used to register commands with the Discord API
// Note: Command names should be lowercase with hyphens (Discord API requirement)
// Example: 'tune-downforce' (not 'Tune-Downforce')

/**
 * Slash command: /tune-downforce
 * Purpose: Calculate grip-optimized downforce and suspension frequency for a GT7 vehicle
 * Input: Car weight, weight distribution percentage, and tire compound
 * Output: Downforce values and natural frequencies for front/rear suspension
 */
export const TUNEDOWNFORCE_COMMAND = {
  name: 'Tune-Downforce',  // Name shown in Discord command picker (should be kebab-case: tune-downforce)
  description: 'Tune for optimal downforce based on weight, balance, and tire.',  // Help text
  options: [
    {
      name: 'weight',                                 // Parameter name
      description: 'Car weight in pounds (lbs)',      // Parameter description
      type: 10, // num (10 = number type)
      required: true,                                  // User must provide
      min_value: 1000,                                 // Minimum weight (realistic car weight)
      max_value: 5000,                                 // Maximum weight (GT7 max)
    },
    {
      name: 'front',                                   // Parameter name for weight distribution
      description: 'Front weight distribution % (e.g. 54)',  // Parameter description
      type: 10, // num (10 = number type)
      required: true,
      min_value: 30,                                   // Minimum safe front weight %
      max_value: 70,                                   // Maximum safe front weight %
    },
    {
      name: 'tire',                                    // Parameter name
      description: 'Tire compound',                    // Parameter description
      type: 3, // string (3 = string with predefined choices)
      required: true,
      choices: [
        // Dropdown options for tire selection
        // Format: { name: 'Display name', value: 'code used in calculation' }
        { name: 'Comfort Hard',   value: 'ch' },      // Lowest grip
        { name: 'Comfort Medium', value: 'cm' },
        { name: 'Comfort Soft',   value: 'cs' },
        { name: 'Sports Hard',    value: 'sh' },
        { name: 'Sports Medium',  value: 'sm' },
        { name: 'Sports Soft',    value: 'ss' },
        { name: 'Racing Hard',    value: 'rh' },
        { name: 'Racing Medium',  value: 'rm' },
        { name: 'Racing Soft',    value: 'rs' },      // Highest grip
      ],
    },
  ]
};

/**
 * Slash command: /tune-transmission
 * Purpose: Placeholder for future transmission tuning feature
 * Status: Not yet implemented
 */
export const TUNETRANSMISSION_COMMAND = {
  name: 'Tune-Transmission',                          // Name shown in Discord (should be kebab-case: tune-transmission)
  description: 'Tune transmission based on track and car.',  // Help text
  // No options defined yet; to be implemented in future version
};