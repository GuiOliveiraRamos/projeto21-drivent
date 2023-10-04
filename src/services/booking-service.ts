import { error } from 'console';
import { TicketStatus } from '@prisma/client';
import { notFoundError } from '@/errors';
import { enrollmentRepository, hotelRepository, ticketsRepository } from '@/repositories';
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

async function postBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status === TicketStatus.RESERVED || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw error(403, 'forbidden action');
    // ARQUITETAR O ERRO
  }

  const checkRoom = await hotelRepository.findRoomById(roomId);
  if (!checkRoom) throw notFoundError();
  if (checkRoom.Booking.length >= checkRoom.capacity) {
    throw error(403, 'forbidden action');
    // ARQUITETAR O ERRO
  }

  const result = await bookingRepository.createBooking(userId, roomId);

  return {
    bookingId: result.id,
  };
}

const bookingService = {
  getBookings,
  postBooking,
};

export default bookingService;
