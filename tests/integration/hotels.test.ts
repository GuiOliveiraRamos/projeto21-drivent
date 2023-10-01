import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel, createHotelsWithRooms } from '../factories/hotels-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const api = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await api.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('when token is valid', () => {
  it('should respond with status 404 when the user does not have an enrollment yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const { status } = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when the user does not have a ticket yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    await createEnrollmentWithAddress(user);

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 when ticket type is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(undefined, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 and list of hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(undefined, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);
    const hotelTestOne = await createHotel();
    const hotelTestTwo = await createHotel();

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.OK);

    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          ...hotelTestOne,
          updatedAt: new Date(hotelTestOne.updatedAt).toISOString(),
          createdAt: new Date(hotelTestOne.createdAt).toISOString(),
        },
        {
          ...hotelTestTwo,
          updatedAt: new Date(hotelTestTwo.updatedAt).toISOString(),
          createdAt: new Date(hotelTestTwo.createdAt).toISOString(),
        },
      ]),
    );
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await api.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('when token is valid', () => {
  it('should respond with status 404 when the user does not have an enrollment yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const { status } = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when the hotel does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const includesHotel = true;
    const ticketType = await createTicketType(undefined, includesHotel);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);
    await createHotel();

    const response = await api.get('/hotels/80').set('Authorization', `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 and the hotel data', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const includesHotel = true;
    const ticketType = await createTicketType(undefined, includesHotel);
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    await createPayment(ticket.id, ticketType.price);

    const createHotel = await createHotelsWithRooms();
    const body = {
      id: createHotel.id,
      name: createHotel.name,
      image: createHotel.image,
      createdAt: createHotel.createdAt.toISOString(),
      updatedAt: createHotel.updatedAt.toISOString(),
      Rooms: [
        {
          id: createHotel.Rooms[0].id,
          name: createHotel.Rooms[0].name,
          hotelId: createHotel.Rooms[0].hotelId,
          capacity: createHotel.Rooms[0].capacity,
          createdAt: createHotel.Rooms[0].createdAt.toISOString(),
          updatedAt: createHotel.Rooms[0].updatedAt.toISOString(),
        },
        {
          id: createHotel.Rooms[1].id,
          name: createHotel.Rooms[1].name,
          capacity: createHotel.Rooms[1].capacity,
          hotelId: createHotel.Rooms[1].hotelId,
          createdAt: createHotel.Rooms[1].createdAt.toISOString(),
          updatedAt: createHotel.Rooms[1].updatedAt.toISOString(),
        },
      ],
    };
    const response = await api.get(`/hotels/${createHotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual(body);
  });
});
