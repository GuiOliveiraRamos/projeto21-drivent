import faker from '@faker-js/faker';
import { Booking, Room } from '@prisma/client';
import { cleanDb } from '../helpers';
import { init } from '@/app';
import bookingService from '@/services/booking-service';
import bookingRepository from '@/repositories/booking-repository';
import { notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { forbiddenError } from '@/errors/forbidden-error';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

const mockBooking: Booking & { Room: Room } = {
  id: 1,
  userId: 1,
  roomId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  Room: {
    id: 1,
    name: faker.name.findName(),
    capacity: 1,
    hotelId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

const mockEnrollment = {
  id: 1,
  name: faker.name.findName(),
  cpf: '12345678910',
  birthday: new Date(),
  phone: '123456789',
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRemoteTicket = {
  id: 1,
  ticketTypeId: 1,
  enrollmentId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  TicketType: {
    id: 1,
    name: faker.name.findName(),
    price: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    isRemote: true,
    includesHotel: true,
  },
};

const mockWithNoHotel = {
  id: 1,
  ticketTypeId: 1,
  enrollmentId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  TicketType: {
    id: 1,
    name: faker.name.findName(),
    price: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    isRemote: false,
    includesHotel: false,
  },
};

const mockTicket = {
  id: 1,
  ticketTypeId: 1,
  enrollmentId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  TicketType: {
    id: 1,
    name: faker.name.findName(),
    price: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    isRemote: false,
    includesHotel: true,
  },
};

describe('getBookings', () => {
  it('should return not found error when booking does not exists', async () => {
    jest.spyOn(bookingRepository, 'getBookings').mockResolvedValueOnce(null);

    const result = bookingService.getBookings(1);

    expect(result).rejects.toEqual(notFoundError());
  });
  it('should return booking when booking exists', async () => {
    jest.spyOn(bookingRepository, 'getBookings').mockResolvedValue(mockBooking);

    const result = await bookingService.getBookings(1);

    expect(result).toEqual(mockBooking);
  });
});

describe('createBooking', () => {
  it('should return forbidden error when ticket type is remote', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue({
      ...mockEnrollment,
      Address: [
        {
          id: 1,
          cep: '12345-678',
          street: 'rua teste',
          city: 'cidade teste',
          state: 'estado teste',
          number: '123',
          neighborhood: 'neighborhood teste',
          addressDetail: 'none',
          enrollmentId: 1,
          createdAt: new Date('2023-10-09T00:00:00.000'),
          updatedAt: new Date('2023-10-09T00:00:00.000'),
        },
      ],
    });
    jest.spyOn(ticketsRepository, 'findTicketById').mockResolvedValue({ ...mockRemoteTicket, status: 'PAID' });

    const result = bookingService.postBooking(1, 1);
    expect(result).rejects.toEqual(forbiddenError());
  });

  it('should return forbidden error when ticket type does not include hotel', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue({
      ...mockEnrollment,
      Address: [
        {
          id: 1,
          cep: '12345-678',
          street: 'rua teste',
          city: 'cidade teste',
          state: 'estado teste',
          number: '123',
          neighborhood: 'neighborhood teste',
          addressDetail: 'none',
          enrollmentId: 1,
          createdAt: new Date('2023-10-09T00:00:00.000'),
          updatedAt: new Date('2023-10-09T00:00:00.000'),
        },
      ],
    });
    jest.spyOn(ticketsRepository, 'findTicketById').mockResolvedValue({ ...mockWithNoHotel, status: 'PAID' });

    const result = bookingService.postBooking(1, 1);
    expect(result).rejects.toEqual(forbiddenError());
  });

  it('should return forbidden error when ticket is not paid', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue({
      ...mockEnrollment,
      Address: [
        {
          id: 1,
          cep: '12345-678',
          street: 'rua teste',
          city: 'cidade teste',
          state: 'estado teste',
          number: '123',
          neighborhood: 'neighborhood teste',
          addressDetail: 'none',
          enrollmentId: 1,
          createdAt: new Date('2023-10-09T00:00:00.000'),
          updatedAt: new Date('2023-10-09T00:00:00.000'),
        },
      ],
    });
    jest.spyOn(ticketsRepository, 'findTicketById').mockResolvedValue({ ...mockTicket, status: 'RESERVED' });

    const result = bookingService.postBooking(1, 1);
    expect(result).rejects.toEqual(forbiddenError());
  });
});

describe('putBooking', () => {
  it('should return not found error when booking does not exists', async () => {
    jest.spyOn(bookingRepository, 'getBookings').mockResolvedValueOnce(null);

    const result = bookingService.getBookings(1);

    expect(result).rejects.toEqual(notFoundError());
  });
});
