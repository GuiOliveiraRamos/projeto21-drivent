import { Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import { ticketsRepository } from '@/repositories/tickets-repository';

async function getTicketsTypes(): Promise<TicketType[]> {
  const getAllTicketsTypes: TicketType[] = await ticketsRepository.getTicketsTypes();
  if (getAllTicketsTypes.length === 0) return [];
  return getAllTicketsTypes;
}

async function getUserTicket(enrollmentId: number, ticketId: number): Promise<Ticket> {
  const verifyEnrollment = await ticketsRepository.findUserEnrollment(enrollmentId);
  if (!verifyEnrollment) throw notFoundError();

  const verifyTicket = await ticketsRepository.findUserTicket(ticketId);
  if (!verifyTicket) throw notFoundError();

  return verifyTicket;
}

export const ticketsService = {
  getTicketsTypes,
};
