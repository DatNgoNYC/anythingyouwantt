/* This file represents the db connection used in the models. */

import pgPromise from 'pg-promise';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

const db = pgPromise()(dbUrl);

export default db;
