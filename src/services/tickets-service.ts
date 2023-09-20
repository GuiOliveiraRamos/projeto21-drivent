import { ticketsRepository } from '@/repositories/tickets-repository';

async function getTicketsTypes() {
  const getAllTicketsTypes = ticketsRepository.getTicketsTypes();
  if ((await getAllTicketsTypes).length === 0) return [];
  return getAllTicketsTypes;
}

export const ticketsService = {
  getTicketsTypes,
};
