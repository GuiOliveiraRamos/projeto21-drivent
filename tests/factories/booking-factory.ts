import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: {
      id: true,
    },
  });
}

export async function editBooking(id: number, roomId: number) {
  return await prisma.booking.update({
    data: {
      roomId,
    },
    where: {
      id,
    },
  });
}
