import { prisma } from '@/config';

async function getTicketsTypes() {
  const getAllTicketsTypes = prisma.ticketType.findMany();
  return getAllTicketsTypes;
}

export const ticketsRepository = {
  getTicketsTypes,
};
