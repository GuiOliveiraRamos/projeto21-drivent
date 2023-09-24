import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import { ticketsRepository } from '@/repositories/tickets-repository';
import { TicketData } from '@/protocols';
import { enrollmentRepository } from '@/repositories';

async function getTicketsTypes(): Promise<TicketType[]> {
  const getAllTicketsTypes: TicketType[] = await ticketsRepository.getTicketsTypes();
  if (getAllTicketsTypes.length === 0) return [];
  return getAllTicketsTypes;
}

async function getUserTicket(userId: number): Promise<Ticket> {
  const verifyEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!verifyEnrollment) throw notFoundError();

  const verifyTicket = await ticketsRepository.findUserEnrollment(verifyEnrollment.id);
  if (!verifyTicket) throw notFoundError();

  return verifyTicket;
}

async function postNewTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const verifyEnrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!verifyEnrollment) throw notFoundError();

  const ticketData: TicketData = {
    ticketTypeId,
    enrollmentId: verifyEnrollment.id,
    status: TicketStatus.RESERVED,
  };

  await ticketsRepository.createTicket(ticketData);

  const result = await ticketsRepository.findUserEnrollment(verifyEnrollment.id);

  return result;
}

export const ticketsService = {
  getTicketsTypes,
  getUserTicket,
  postNewTicket,
};
