import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getEnrollmentByUser, postCreateOrUpdateEnrollment, getAddressFromCEP } from '@/controllers';
import { createOrUpdateEnrollmentSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getAddressFromCEP)
  .post('/', getEnrollmentByUser)
  .post('/:bookingId', validateBody(createOrUpdateEnrollmentSchema), postCreateOrUpdateEnrollment);

export { bookingRouter };
