// Node.js script to register Discord slash commands with Discord API
// Run via: npm run register
// This is a one-time setup step; commands persist in Discord after registration

import dotenv from 'dotenv';  // Load environment variables from .dev.vars
import process from 'node:process';  // Access process.env for credentials

/**
 * This file is meant to be run from the command line, and is not used by the
 * application server.  It's allowed to use node.js primitives, and only needs
 * to be run once.
 */

// Load environment variables from .dev.vars file into process.env
dotenv.config({ path: '.dev.vars' });

// Retrieve Discord bot credentials from environment variables
const token = process.env.DISCORD_TOKEN;              // Bot's authentication token
const applicationId = process.env.DISCORD_APPLICATION_ID;  // Discord App ID (bot ID)

// Validate that required environment variables are set before attempting registration
if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error(
    'The DISCORD_APPLICATION_ID environment variable is required.',
  );
}

// Command definitions with lowercase names (matches Discord API requirements)
// Name must be lowercase alphanumeric and hyphens only
const TUNEDOWNFORCE_COMMAND = {
  name: 'tune-downforce',  // Lowercase command name as typed by user: /tune-downforce
  description: 'GT7 grip-optimized downforce & natural frequency',  // Shown in Discord command picker
  options: [  // Parameters users can pass to the command
    {
      name: 'weight',                                 // Parameter name
      description: 'Car weight in pounds (lbs)',      // Help text
      type: 10,                                        // 10 = number type
      required: true,                                  // Must provide value
      min_value: 1000,                                 // Constraint: minimum weight
      max_value: 5000,                                 // Constraint: maximum weight
    },
    {
      name: 'front',                                   // Parameter name for weight distribution %
      description: 'Front weight distribution % (e.g. 54)',
      type: 10,                                        // 10 = number type
      required: true,
      min_value: 30,                                   // Minimum safe front weight distribution
      max_value: 70,                                   // Maximum safe front weight distribution
    },
    {
      name: 'tire',                                    // Parameter name for tire selection
      description: 'Tire compound',
      type: 3,                                         // 3 = string with predefined choices
      required: true,
      choices: [
        // Dropdown options user selects from
        { name: 'Comfort Hard', value: 'ch' }, { name: 'Comfort Medium', value: 'cm' }, { name: 'Comfort Soft', value: 'cs' },
        { name: 'Sports Hard', value: 'sh' }, { name: 'Sports Medium', value: 'sm' }, { name: 'Sports Soft', value: 'ss' },
        { name: 'Racing Hard', value: 'rh' }, { name: 'Racing Medium', value: 'rm' }, { name: 'Racing Soft', value: 'rs' },
      ],
    },
  ],
};

// Placeholder command for future transmission tuning feature
const TUNETRANSMISSION_COMMAND = {
  name: 'tune-transmission',                   // Lowercase command name
  description: 'Tune transmission based on track and car.',  // Shown in Discord
};

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
// Construct URL for Discord's command registration API endpoint
const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

// Send PUT request to Discord API with command definitions
// PUT replaces all registered commands (adds new + updates existing + removes unlisted ones)
const response = await fetch(url, {
  headers: {
    'Content-Type': 'application/json',              // Indicate JSON payload
    Authorization: `Bot ${token}`,                   // Bot authentication header
  },
  method: 'PUT',  // PUT = register/update all commands at once
  body: JSON.stringify([TUNEDOWNFORCE_COMMAND, TUNETRANSMISSION_COMMAND]),  // Array of commands to register
});

// Check if command registration succeeded
if (response.ok) {
  // Success: commands registered successfully
  console.log('Registered all commands');
  // Parse response to show registration details
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));  // Pretty-print registered command objects
} else {
  // Failure: Discord API returned an error
  console.error('Error registering commands');
  // Build detailed error message including URL, status, and response body
  let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
  try {
    // Attempt to read error details from response body
    const error = await response.text();
    if (error) {
      errorText = `${errorText} \n\n ${error}`;
    }
  } catch (err) {
    // If body reading fails, log that error
    console.error('Error reading body from request:', err);
  }
  // Log full error details for debugging
  console.error(errorText);
}