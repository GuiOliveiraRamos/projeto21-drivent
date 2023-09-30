import exp from 'constants';
import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel } from '../factories/hotels-factory';
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
    const token = await generateValidToken();
    const { status } = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when the user does not have a ticket yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    await createEnrollmentWithAddress(user);

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 when ticket type is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 and list of hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);

    const createdHotel = await createHotel();

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);

    expect(response.body).toEqual([
      {
        id: createdHotel.id,
        name: createdHotel.name,
        image: createdHotel.image,
        createdAt: createdHotel.createdAt.toISOString(),
        updatedAt: createdHotel.updatedAt.toISOString(),
      },
    ]);
  });
});
