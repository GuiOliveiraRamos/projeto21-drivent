import { Response } from 'express';
import httpStatus from 'http-status';
import { notFoundError, requestError } from '@/errors';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const result = await bookingService.getBookings(userId);

  return res.status(httpStatus.OK).send(result);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  if (!roomId) throw notFoundError();

  const result = await bookingService.postBooking(userId, roomId);
  res.status(httpStatus.OK).send(result);
}

export async function editBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const bookingId = Number(req.params.bookingId);

  if (bookingId <= 0 || isNaN(bookingId)) throw requestError(400, 'invalid bookingId');

  const result = await bookingService.editBooking(userId, roomId, bookingId);
  res.status(httpStatus.OK).send(result);
}
