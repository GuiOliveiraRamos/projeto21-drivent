import { Router } from 'express';
import { getTicketsTypes, getUserTickets } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getTicketsTypes).get('/', getUserTickets).post('/');

export { ticketsRouter };
