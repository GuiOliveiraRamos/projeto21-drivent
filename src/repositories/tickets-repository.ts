import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketsTypes(): Promise<TicketType[]> {
  const getAllTicketsTypes = prisma.ticketType.findMany();
  return getAllTicketsTypes;
}

export const ticketsRepository = {
  getTicketsTypes,
};
