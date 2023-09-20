import { Response } from 'express';
import httpStatus from 'http-status';
import { ticketsService } from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const getAllTicketsTypes = await ticketsService.getTicketsTypes();
  res.status(httpStatus.OK).send(getAllTicketsTypes);
}
