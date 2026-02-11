// src/register.js
import { data as tuneDownforceData } from './commands/tune-downforce/index.js';

const commands = [
  tuneDownforceData,
  // Add more commands here later, e.g. anotherData,
];

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
const GUILD_ID = process.env.GUILD_ID; // optional for faster testing

const url = GUILD_ID
  ? `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/guilds/${GUILD_ID}/commands`
  : `https://discord.com/api/v10/applications/${DISCORD_APPLICATION_ID}/commands`;

fetch(url, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${DISCORD_TOKEN}`,
  },
  body: JSON.stringify(commands),
})
  .then(res => {
    if (!res.ok) throw new Error(`Failed: ${res.status} - ${res.statusText}`);
    return res.json();
  })
  .then(data => console.log('Registered commands:', data))
  .catch(err => console.error('Registration failed:', err));