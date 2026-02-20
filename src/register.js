import dotenv from 'dotenv';
import process from 'node:process';

/**
 * This file is meant to be run from the command line, and is not used by the
 * application server.  It's allowed to use node.js primitives, and only needs
 * to be run once.
 */

dotenv.config({ path: '.dev.vars' });

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error(
    'The DISCORD_APPLICATION_ID environment variable is required.',
  );
}

// Command definitions with lowercase names
const TUNEDOWNFORCE_COMMAND = {
  name: 'tune-downforce',
  description: 'GT7 grip-optimized downforce & natural frequency',
  options: [
    {
      name: 'weight',
      description: 'Car weight in pounds (lbs)',
      type: 10,
      required: true,
      min_value: 1000,
      max_value: 5000,
    },
    {
      name: 'front',
      description: 'Front weight distribution % (e.g. 54)',
      type: 10,
      required: true,
      min_value: 30,
      max_value: 70,
    },
    {
      name: 'tire',
      description: 'Tire compound',
      type: 3,
      required: true,
      choices: [
        { name: 'Comfort Hard', value: 'ch' }, { name: 'Comfort Medium', value: 'cm' }, { name: 'Comfort Soft', value: 'cs' },
        { name: 'Sports Hard', value: 'sh' }, { name: 'Sports Medium', value: 'sm' }, { name: 'Sports Soft', value: 'ss' },
        { name: 'Racing Hard', value: 'rh' }, { name: 'Racing Medium', value: 'rm' }, { name: 'Racing Soft', value: 'rs' },
      ],
    },
  ],
};

const TUNETRANSMISSION_COMMAND = {
  name: 'tune-transmission',
  description: 'Tune transmission based on track and car.',
};

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;

const response = await fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${token}`,
  },
  method: 'PUT',
  body: JSON.stringify([TUNEDOWNFORCE_COMMAND, TUNETRANSMISSION_COMMAND]),
});

if (response.ok) {
  console.log('Registered all commands');
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
} else {
  console.error('Error registering commands');
  let errorText = `Error registering commands \n ${response.url}: ${response.status} ${response.statusText}`;
  try {
    const error = await response.text();
    if (error) {
      errorText = `${errorText} \n\n ${error}`;
    }
  } catch (err) {
    console.error('Error reading body from request:', err);
  }
  console.error(errorText);
}