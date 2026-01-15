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