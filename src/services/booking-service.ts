import { notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import bookingRepository from '@/repositories/booking-repository';

async function getBookings(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const result = await bookingRepository.getBookings(userId);

  if (!result) throw notFoundError();

  return result;
}

const bookingService = {
  getBookings,
};

export default bookingService;
