import { notFoundError } from '@/errors';
import { PaymentRequiredError } from '@/errors/payment-required-error';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { hotelsRepository } from '@/repositories/hotel.repository';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status !== 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw PaymentRequiredError();

  const listHotels = await hotelsRepository.findHotels();
  return listHotels;
}

async function getRooms(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status !== 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw PaymentRequiredError();

  const rooms = await hotelsRepository.findRooms(hotelId);

  if (!rooms) throw notFoundError();

  return rooms;
}

export const hotelsService = {
  getHotels,
  getRooms,
};
