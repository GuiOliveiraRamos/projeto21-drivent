import { Response } from 'express';
import httpStatus from 'http-status';
import { ticketsService } from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const getAllTicketsTypes = await ticketsService.getTicketsTypes();
  res.status(httpStatus.OK).send(getAllTicketsTypes);
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const tickets = await ticketsService.getUserTicket(userId);
  res.status(httpStatus.OK).send(tickets);
}

export async function postNewTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId }: { ticketTypeId: number } = req.body;
  const ticket = await ticketsService.postNewTicket(userId, ticketTypeId);
  res.status(httpStatus.CREATED).send(ticket);
}
