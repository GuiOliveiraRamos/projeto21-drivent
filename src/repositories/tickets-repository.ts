import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketsTypes(): Promise<TicketType[]> {
  const getAllTicketsTypes = prisma.ticketType.findMany();
  return getAllTicketsTypes;
}

async function findUserEnrollment(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findUserTicket(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function createTicket(ticket: Ticket) {
  return prisma.ticket.create({
    data: ticket,
  });
}

export const ticketsRepository = {
  getTicketsTypes,
  findUserEnrollment,
  findUserTicket,
  createTicket,
};
