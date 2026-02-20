// src/utils.js
export class JsonResponse extends Response {
  constructor(body, init = {}) {
    const jsonBody = JSON.stringify(body);
    init = {
      ...init,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        ...init.headers,
      },
    };
    super(jsonBody, init);
  }
}

// Helper to create deferred response (type 5) for main calculation logic.
export function deferReply() {
  return new Response(
    JSON.stringify({ type: 5 }), // Defer Channel Message
    { headers: { 'Content-Type': 'application/json' } }
  );
}