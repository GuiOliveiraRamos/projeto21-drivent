import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingRepository from '@/repositories/booking-repository';
import bookingService from '@/services/booking-service';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await bookingService.getBookings(userId);

  return res.status(httpStatus.OK).send(result);
}
