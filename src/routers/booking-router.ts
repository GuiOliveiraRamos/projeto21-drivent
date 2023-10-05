import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { editBooking, getBookings, postBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBookings).post('/', postBooking).put('/:bookingId', editBooking);

export { bookingRouter };
