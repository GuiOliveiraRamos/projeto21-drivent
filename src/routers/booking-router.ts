import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createOrUpdateEnrollmentSchema } from '@/schemas';
import { editBooking, getBookings, postBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBookings)
  .post('/', postBooking)
  .post('/:bookingId', editBooking);

export { bookingRouter };
