import { OpenAPIHono } from '@hono/zod-openapi';
import { listMessagesHandler, sendMessageHandler, uploadAttachmentHandler } from './handlers';
import { listMessagesRoute, sendMessageRoute, uploadAttachmentRoute } from './routes';
import type { Env } from '../shared/types';

export const chatRouter = new OpenAPIHono<Env>()
  .openapi(uploadAttachmentRoute, uploadAttachmentHandler)
  .openapi(sendMessageRoute, sendMessageHandler)
  .openapi(listMessagesRoute, listMessagesHandler);
