import { Router } from 'express';
import { getTicketsTypes } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
  // .all('/*', authenticateToken)
  .get('/types', getTicketsTypes)
  .get('/')
  .post('/');

export { ticketsRouter };
