// src/utils.js
// Utility classes and functions for JSON response handling and Discord interaction management

// Custom Response class that automatically wraps JSON payloads with correct headers for Discord API
// Ensures all JSON responses are properly serialized and include the correct content-type header
export class JsonResponse extends Response {
  constructor(body, init = {}) {
    // Serialize JavaScript object to JSON string for transmission
    const jsonBody = JSON.stringify(body);
    // Merge provided init config with default JSON headers
    init = {
      ...init,
      headers: {
        'content-type': 'application/json;charset=UTF-8',  // Tell server/client this is JSON
        ...init.headers,  // Allow caller to override headers if needed
      },
    };
    // Call parent Response constructor with serialized JSON body
    super(jsonBody, init);
  }
}

// Create a deferred response object (type 5) for long-running Discord commands
// This tells Discord to show a loading state while the bot processes the command
// Gives bot up to 15 minutes to send the final response via webhook (instead of 3-second limit)
export function deferReply() {
  return new Response(
    JSON.stringify({ type: 5 }), // Type 5 = Deferred Channel Message response
    { headers: { 'Content-Type': 'application/json' } }  // Identify as JSON
  );
}