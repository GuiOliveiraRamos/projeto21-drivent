import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return await prisma.room.create({
    data: {
      name: '123',
      capacity: 2,
      hotelId: hotelId,
    },
  });
}

export async function createHotelsWithRooms() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
      Rooms: {
        createMany: {
          data: [
            {
              name: 'test',
              capacity: 2,
            },
            {
              name: 'test2',
              capacity: 3,
            },
          ],
        },
      },
    },
    include: {
      Rooms: true,
    },
  });
}
