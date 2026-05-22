// Domain errors — thrown by the data layer, translated to HTTP status codes
// by the global onError handler. Handlers stay free of Prisma error codes.

// A request conflicts with the current state, e.g. a duplicate unique value.
// Maps to HTTP 409.
export class ConflictError extends Error {
  constructor(message = 'Resource already exists') {
    super(message);
    this.name = 'ConflictError';
  }
}

// A referenced record does not exist. Maps to HTTP 404.
export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
