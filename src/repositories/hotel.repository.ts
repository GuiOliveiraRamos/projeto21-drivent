import { prisma } from '@/config';
import { notFoundError } from '@/errors';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findHotelsById(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

export const hotelsRepository = {
  findHotels,
  findHotelsById,
};
