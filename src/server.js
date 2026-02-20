import { verifyKey } from 'discord-interactions';
import { JsonResponse } from './utils.js';
import { handleTuneDownforce, command as tuneDownforceCommand } from './commands/tune-downforce/index.js';

const commandHandlers = {
  'tune-downforce': handleTuneDownforce,
};

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed – only POST supported for Discord interactions', {
        status: 405,
        headers: { Allow: 'POST' },
      });
    }

    // Verify signature
    const signature = request.headers.get('x-signature-ed25519');
    const timestamp = request.headers.get('x-signature-timestamp');
    if (!signature || !timestamp) {
      return new Response('Missing signature headers', { status: 401 });
    }

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

    let interaction;
    try {
      interaction = JSON.parse(body);
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    // Handle PING (required for verification)
    if (interaction.type === 1) {
      return JsonResponse({ type: 1 });
    }

    // Handle Application Command (slash command)
    if (interaction.type === 2) {
      const handler = commandHandlers[interaction.data.name];

      if (!handler) {
        return JsonResponse({
          type: 4,
          data: { content: `Unknown command: ${interaction.data.name}` },
        });
      }

      // ────────────────────────────────────────────────
      // Immediately defer the reply (type 5) so we have 15 min
      // This must be sent within ~3 seconds
      const deferPromise = fetch(
        `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 5 }), // Deferred Channel Message
        }
      );

      // Fire-and-forget the actual handling (runs in background)
      (async () => {
        try {
          await handler(interaction, env);
          // handler already edits @original via webhook — nothing more needed
        } catch (err) {
          console.error('Command handler failed:', err);

          // Best-effort error edit
          const errorBody = {
            embeds: [
              {
                title: 'Error',
                description: 'Something went wrong during tuning. Please try again.',
                color: 0xff0000,
              },
            ],
          };

          await fetch(
            `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(errorBody),
            }
          ).catch(() => {}); // silent fail if edit errors
        }
      })();

      // Return the defer response immediately
      const deferResponse = await deferPromise;
      if (!deferResponse.ok) {
        console.error('Failed to defer interaction');
      }

      return new Response(null, { status: 204 }); // No content — we already sent via fetch
      // Alternative: return JsonResponse({ type: 5 });  ← also fine, but fetch is more reliable in some CF setups
    }

    return new Response('Unhandled interaction type', { status: 400 });
  },

  // Optional: add this for command registration (run manually or via wrangler)
  async registerCommands(env) {
    const url = `https://discord.com/api/v10/applications/${env.DISCORD_APP_ID}/commands`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${env.DISCORD_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([tuneDownforceCommand]),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Failed to register commands:', err);
      throw new Error('Command registration failed');
    }

    console.log('Slash commands registered successfully');
  },
};