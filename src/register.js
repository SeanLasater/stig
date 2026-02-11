import { data as tuneDownforceData } from './commands/tune-downforce/index.js';

const commands = [
  tuneDownforceData,
  // more commands later
];

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
const GUILD_ID = process.env.DISCORD_TEST_GUILD_ID; // optional

// Debug: show what we actually have
console.log('Environment:');
console.log('  Token:', DISCORD_TOKEN ? 'present (hidden)' : 'MISSING');
console.log('  App ID:', APPLICATION_ID || 'MISSING');
console.log('  Guild ID:', GUILD_ID || 'not set (using global scope)');

if (!DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN is not set');
}
if (!APPLICATION_ID) {
  throw new Error('DISCORD_APPLICATION_ID is not set');
}

const url = GUILD_ID
  ? `https://discord.com/api/v10/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`
  : `https://discord.com/api/v10/applications/${APPLICATION_ID}/commands`;

console.log('Registering to:', url);

fetch(url, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${DISCORD_TOKEN}`,
  },
  body: JSON.stringify(commands),
})
  .then(async (res) => {
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Failed: ${res.status} ${res.statusText}\n${errorBody}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log('Successfully registered commands:');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    console.error('Registration failed:', err.message);
  });