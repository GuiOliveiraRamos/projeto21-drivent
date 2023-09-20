import { TicketType } from '@prisma/client';
import { ticketsRepository } from '@/repositories/tickets-repository';

async function getTicketsTypes(): Promise<TicketType[]> {
  const getAllTicketsTypes: TicketType[] = await ticketsRepository.getTicketsTypes();
  console.log(getAllTicketsTypes);
  if (getAllTicketsTypes.length === 0) return [];
  return getAllTicketsTypes;
}

export const ticketsService = {
  getTicketsTypes,
};
