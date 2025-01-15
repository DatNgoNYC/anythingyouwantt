import { jest } from '@jest/globals';

// Mocking the Google Auth service
jest.unstable_mockModule('../src/services/google-auth.js', () => ({
  verifyGoogleIdToken: jest.fn((idToken: string) => {
    return new Promise((resolve) => {
      resolve({
        userId: `id_${idToken}`,
        name: `first_${idToken} last_${idToken}`,
        email: `${idToken}@gmail.com`,
        pfp: `https://${idToken}.com`,
      });
    });
  }) as typeof verifyGoogleIdToken,
}));

// Mock the entire RedisService module
jest.unstable_mockModule('../src/services/redis-service.js', () => ({
  RedisService: {
    queueOrderToDeliverJob: jest.fn(async () => {
      return new Promise((resolve) => {
        resolve('');
      });
    }),
  },
}));

// Disabled because of supertest incompatibility
/* eslint-disable @typescript-eslint/no-misused-promises */

import { initializeDatabase } from '../src/database/utils/init.js';
import db from '../src/database/utils/connect.js';
import type { verifyGoogleIdToken } from '../src/services/google-auth.js';
import type { Order } from '../src/database/models/order.js';
const { default: request } = await import('supertest');
const { default: app } = await import('../src/app.js');

beforeAll(async () => {
  try {
    await initializeDatabase();
  } catch {
    throw new Error('Database connection failed');
  }
});

afterEach(async () => {
  await db.query('TRUNCATE TABLE "Orders" CASCADE;');
  await db.query('TRUNCATE TABLE "User" CASCADE;');
});

afterAll(async () => {
  // Drop all tables in the schema
  await db.query(`
    DO $$ DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
            EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
    END $$;`);

  // Close the database connection pool
  await db.$pool.end();
});

describe('/api/orders', () => {
  describe('POST /api/order', () => {
    describe('Unauthorized Requests (401)', () => {
      it('should return 401 when the authorization header is missing or invalid', async () => {
        const res = await request(app).post('/api/order').send({});

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({
          error: 'Authorization header is missing or invalid.',
        });
      });

      it('should return 401 when authentication fails (user does not exist)', async () => {
        const res = await request(app).post('/api/order').set('authorization', 'id_abc').send({});

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ error: 'Authentication failed.' });
      });
    });

    describe('Bad Requests (400)', () => {
      it('should return 400 when the request body is missing', async () => {
        const googleIdToken = 'abc';
        await request(app).post('/api/user').send({ googleIdToken });

        const res = await request(app).post('/api/order').set('authorization', 'id_abc').send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          error: "Missing or invalid required field 'title'.",
        });
      });

      it('should return 400 when the request body is invalid (whitespace only or empty string)', async () => {
        const googleIdToken = 'abc';
        await request(app).post('/api/user').send({ googleIdToken });

        const resWhitespaceTitle = await request(app)
          .post('/api/order')
          .set('authorization', 'id_abc')
          .send({ title: '     ' });

        expect(resWhitespaceTitle.statusCode).toBe(400);
        expect(resWhitespaceTitle.body).toEqual({
          error: "Missing or invalid required field 'title'.",
        });

        const resEmptyTitle = await request(app).post('/api/order').set('authorization', 'id_abc').send({ title: '' });

        expect(resEmptyTitle.statusCode).toBe(400);
        expect(resEmptyTitle.body).toEqual({
          error: "Missing or invalid required field 'title'.",
        });
      });
    });

    it('should return 201 when order is successfully created', async () => {
      const googleIdToken = 'abc';
      await request(app).post('/api/user').send({ googleIdToken });

      const res = await request(app).post('/api/order').set('authorization', 'id_abc').send({ title: 'order1' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({});
    });

    it('should return 500 when an internal server error occurs', async () => {
      await request(app).post('/api/user').send({ googleIdToken: 'abc' });

      // Simulate a network error
      const querySpy = jest.spyOn(db, 'query').mockRejectedValue(new Error('Database connection failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        return;
      });

      const res = await request(app).post('/api/order').set('authorization', 'id_abc').send({ title: 'failedOrder' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Internal server error.' });

      // Restore db.query to its original implementation
      querySpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('GET /api/orders', () => {
    it('should return 400 when the authorization header is missing or invalid', async () => {
      const res = await request(app).get('/api/orders').send({});

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        error: 'Authorization header is missing or invalid.',
      });
    });

    it('should return 401 when authentication fails (user does not exist)', async () => {
      const res = await request(app).get('/api/order').set('authorization', 'id_abc').send({});

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ error: 'Authentication failed.' });
    });

    describe('Successful Requests (200)', () => {
      it('should return 200 when orders are successfully retrieved', async () => {
        // POST user and POST order
        await request(app).post('/api/user').send({ googleIdToken: 'abc' });
        await request(app).post('/api/order').set('authorization', 'id_abc').send({ title: 'order1' });

        // GET orders
        const res = await request(app).get('/api/orders').set('authorization', 'id_abc').send();

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            orderId: expect.any(String), // UUID generated by the DB
            title: 'order1',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(String), // Timestamp
            deliveredAt: null, // Optional field, null for new orders
          },
        ]);

        // GET orders, where we've POSTed two orders
        await request(app).post('/api/order').set('authorization', 'id_abc').send({ title: 'order2' });

        const res2 = await request(app).get('/api/orders').set('authorization', 'id_abc').send();
        expect(res2.status).toBe(200);
        expect(res2.body).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            orderId: expect.any(String),
            title: 'order2',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(String),
            deliveredAt: null,
          },
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            orderId: expect.any(String),
            title: 'order1',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(String),
            deliveredAt: null,
          },
        ]);

        await request(app).post('/api/order').set('authorization', 'id_abc').send({ title: 'order2' });
        const res3 = await request(app).get('/api/orders').set('authorization', 'id_abc').send();
        expect(res3.status).toBe(200);
        expect(res3.body).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            orderId: expect.any(String), // UUID generated by the DB
            title: 'order2',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(String), // Timestamp
            deliveredAt: null, // Optional field, null for new orders
          },
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            orderId: expect.any(String), // UUID generated by the DB
            title: 'order2',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(String), // Timestamp
            deliveredAt: null, // Optional field, null for new orders
          },
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            orderId: expect.any(String), // UUID generated by the DB
            title: 'order1',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(String), // Timestamp
            deliveredAt: null, // Optional field, null for new orders
          },
        ]);
      });

      it('should return 200 with an empty list when there are no orders', async () => {
        await request(app).post('/api/user').send({ googleIdToken: 'abc' });

        const res = await request(app).get('/api/orders').set('authorization', 'id_abc').send();

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
      });
    });

    it('should return 500 when an internal server error occurs', async () => {
      await request(app).post('/api/user').send({ googleIdToken: 'abc' });

      // Simulate a network error
      const querySpy = jest.spyOn(db, 'query').mockRejectedValue(new Error('Database connection failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        return;
      });

      const res = await request(app).get('/api/order').set('authorization', 'id_abc').send();

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Internal server error.' });

      // Restore db.query to its original implementation
      querySpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('DEL /api/order/:id', () => {
    it('should return 400 when the authorization header is missing or invalid', async () => {
      const res = await request(app).del('/api/orders').send({});

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        error: 'Authorization header is missing or invalid.',
      });
    });

    it('should return 401 when authentication fails (user does not exist)', async () => {
      const res = await request(app).delete('/api/orders').set('authorization', 'id_abc').send({});
      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        error: 'Authentication failed.',
      });
    });

    it('should return 404 when the order does not exist', async () => {
      await request(app).post('/api/user').send({ googleIdToken: 'abc' });

      const res = await request(app).delete('/api/orders/124543').set('authorization', 'id_abc').send({});
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: 'Order not found or not associated with the user.',
      });
    });

    it('should return 204 when order is successfully deleted', async () => {
      await request(app).post('/api/user').send({ googleIdToken: 'abc' });
      await request(app).post('/api/order').set('authorization', 'id_abc').send({ title: 'order1' });

      const res = await request(app).get('/api/orders').set('authorization', 'id_abc').send({});
      // Validate response and parse orders
      expect(res.status).toBe(200);
      const orders = res.body as Order[];

      // Safely access the orderId of the first order
      expect(orders.length).toBeGreaterThan(0); // Ensure there's at least one order
      const orderId = orders[0]?.orderId;
      expect(orderId).toBeDefined(); // Ensure orderId is defined

      // Delete the order
      const deleteRes = await request(app)
        .delete(`/api/orders/${String(orderId)}`)
        .set('authorization', 'id_abc')
        .send();

      // Validate deletion response
      expect(deleteRes.status).toBe(204);
    });

    it('should return 500 when an internal server error occurs', async () => {
      // Simulate a network error
      const querySpy = jest.spyOn(db, 'query').mockRejectedValue(new Error('Database connection failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        return;
      });

      const res = await request(app)
        .delete('/api/orders/123')
        .set('authorization', '123')
        .send({ googleIdToken: 'abc' });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Internal server error.' });

      // Restore db.query to its original implementation
      querySpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });
});
