// server.js...
// DISPATCH TO COMMAND'S EXECUTE


import { verifyKey } from 'discord-interactions';
import { JsonResponse } from './utils.js'
import { execute as tuneDownforceExecute } from './commands/tune-downforce/index.js';
//import { execute as tuneTransmissionExecute } from './commands/tune-downforce/index.js';

const commandHandlers = {
  'tune-downforce': tuneDownforceExecute,
  //'tune-transmission': tuneTransmissionExecute,
};

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed– only POST supported for Discord interactions', { status: 405, headers: { Allow: 'POST' } });
    }

    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    const body = await request.text();

    const isValid = verifyKey(
      timestamp + body,
      signature,
      env.DISCORD_PUBLIC_KEY,
      'hex'
    );

    if (!isValid) {
      return new Response('Invalid signature', { status: 401 });
    }

    const interaction = JSON.parse(body);

    if (interaction.type === 1) { // Ping
      return JsonResponse({ type: 1 });
    }

    if (interaction.type === 2) { // Application Command
      const handler = commandHandlers[interaction.data.name];
      if (handler) {
        try {
          const response = await handler(interaction);
          return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (err) {
          console.error('Command error:', err);
          return new Response(JSON.stringify({
            type: 4,
            data: { content: 'Tuning failed – check inputs!' }
          }), { headers: { 'Content-Type': 'application/json' } });
        }
      } else {
        return new Response(JSON.stringify({
          type: 4,
          data: { content: `Unknown command: ${interaction.data.name}` }
        }), { headers: { 'Content-Type': 'application/json' } });
    }
  }
      /* OLD HANDLER
      const handler = commandHandlers[interaction.data.name.toLowerCase()];
      if (handler) {
        try {
          const response = await handler(interaction);
          return JsonResponse(response);
        } catch (err) {
          console.error(err);
          return JsonResponse({ type: 4, data: { content: 'Error processing command' } });
        }
      }
      return JsonResponse({ type: 4, data: { content: 'Unknown command' } });
    }*/

    return new Response('Not handled', { status: 400 });
  },
};