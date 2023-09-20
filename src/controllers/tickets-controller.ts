import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ticketsService } from '@/services/tickets-service';

export async function getTicketsTypes(req: Request, res: Response) {
  const getAllTicketsTypes = await ticketsService.getTicketsTypes();
  res.status(httpStatus.OK).send(getAllTicketsTypes);
}
