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
describe('/api/user', () => {
  describe('POST /api/user', () => {
    it('should return 400 when the googleIdToken is missing', async () => {
      const res = await request(app).post('/api/user').send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'googleIdToken is required' });
    });

    it('should return 201 when creating a new user', async () => {
      const googleIdToken = 'user1';
      const res = await request(app).post('/api/user').send({ googleIdToken });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        userId: `id_${googleIdToken}`,
        name: `first_${googleIdToken} last_${googleIdToken}`,
        email: `${googleIdToken}@gmail.com`,
        pfp: `https://${googleIdToken}.com`,
      });
    });

    it('should return 200 when POSTing for an existing user', async () => {
      const googleIdToken = 'user1';
      const res = await request(app).post('/api/user').send({ googleIdToken });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        userId: `id_${googleIdToken}`,
        name: `first_${googleIdToken} last_${googleIdToken}`,
        email: `${googleIdToken}@gmail.com`,
        pfp: `https://${googleIdToken}.com`,
      });

      const res2 = await request(app).post('/api/user').send({ googleIdToken });

      expect(res2.statusCode).toBe(200);
      expect(res2.body).toEqual({
        userId: `id_${googleIdToken}`,
        name: `first_${googleIdToken} last_${googleIdToken}`,
        email: `${googleIdToken}@gmail.com`,
        pfp: `https://${googleIdToken}.com`,
      });
    });

    it('should return 500 when an internal server error occurs', async () => {
      // Simulate a network error
      const querySpy = jest.spyOn(db, 'query').mockRejectedValue(new Error('Database connection failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        return;
      });

      const googleIdToken = 'user';
      const res = await request(app).post('/api/user').send({ googleIdToken });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Internal server error.' });

      // Restore db.query to its original implementation
      querySpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('DEL /api/user', () => {
    describe('Unauthorized Requests (401)', () => {
      it('should return 401 when the authorization header is missing or invalid', async () => {
        const res = await request(app).delete('/api/user');

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({
          error: 'Authorization header is missing or invalid.',
        });
      });

      it('should return 401 when authentication fails (user does not exist)', async () => {
        const nonExistentUserId = 'non-existent-user';

        const res = await request(app).delete('/api/user').set('authorization', nonExistentUserId);

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: 'Authentication failed.' });
      });
    });

    it('should return 204 when user successfully deleted', async () => {
      const googleIdToken = 'user1';
      await request(app).post('/api/user').set('Content-Type', 'application/json').send({ googleIdToken });

      const res = await request(app).delete('/api/user').set('authorization', 'id_user1').send();

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });

    it('should return 500 when an internal server error occurs', async () => {
      const googleIdToken = 'user1';
      await request(app).post('/api/user').send({ googleIdToken });

      // Simulate a network error
      const querySpy = jest.spyOn(db, 'query').mockRejectedValue(new Error('Database connection failed'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        return;
      });

      const res = await request(app).delete('/api/user').set('authorization', 'user1').send();

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Internal server error.' });

      // Restore db.query to its original implementation
      querySpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });
});
