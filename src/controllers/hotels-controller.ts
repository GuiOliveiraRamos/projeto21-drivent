import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const listHotels = await hotelsService.getHotels(userId);
  res.status(httpStatus.OK).send(listHotels);
}

export async function getRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  const rooms = await hotelsService.getRooms(userId, Number(hotelId));

  res.status(httpStatus.OK).send(rooms);
}
