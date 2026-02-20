import { verifyKey } from 'discord-interactions';
import { handleTuneDownforce } from './commands/tune-downforce/index';

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

    const signature = request.headers.get('X-Signature-Ed25519');
    const timestamp = request.headers.get('X-Signature-Timestamp');
    const bodyBuffer = await request.arrayBuffer();
    const isValid = verifyKey(
      bodyBuffer,
      signature,
      timestamp,
      env.DISCORD_PUBLIC_KEY
    );

    if (!isValid) {
      return new Response('Bad request signature', { status: 401 });
    }

    const body = JSON.parse(new TextDecoder().decode(bodyBuffer));

    if (body.type === 1) { // Ping
      return new Response(JSON.stringify({ type: 1 }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (body.type === 2 && body.data.name === 'tune-downforce') {
        const defer = deferReply();
        ctx.waituntil(
            handleTuneDownforce(body, env).catch(console.error)
        );
        return defer;
    }

    return new Response('Unknown command', { status: 400 });
  },
};