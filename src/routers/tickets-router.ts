import { Router } from 'express';
import { getTicketsTypes } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.get('/types', getTicketsTypes);
ticketsRouter.get('/');
ticketsRouter.post('/');

export { ticketsRouter };
