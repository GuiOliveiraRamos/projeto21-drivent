import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { notFoundError, requestError } from '@/errors';
import { ticketsRepository } from '@/repositories/tickets-repository';
import { TicketData } from '@/protocols';
import { enrollmentRepository } from '@/repositories';

async function getTicketsTypes(): Promise<TicketType[]> {
  const getAllTicketsTypes: TicketType[] = await ticketsRepository.getTicketsTypes();
  if (getAllTicketsTypes.length === 0) return [];
  return getAllTicketsTypes;
}

async function getUserTicket(userId: number): Promise<Ticket> {
  const verifyEnrollment = await ticketsRepository.findUserEnrollment(userId);
  if (!verifyEnrollment) throw notFoundError();

  const verifyTicket = await ticketsRepository.findUserTicket(verifyEnrollment.id);
  if (!verifyTicket) throw notFoundError();

  return verifyTicket;
}

async function postNewTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const verifyEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!verifyEnrollment) throw notFoundError();

  if (typeof ticketTypeId !== 'number') throw requestError(400, 'ticketTypeId is required');

  const result = await ticketsRepository.createTicket(verifyEnrollment.id, ticketTypeId);

  return result;
}

export const ticketsService = {
  getTicketsTypes,
  getUserTicket,
  postNewTicket,
};
