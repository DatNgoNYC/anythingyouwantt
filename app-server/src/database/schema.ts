import db from './db';

async function initializeDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "uniqueId" PRIMARY KEY,
      "name" VARCHAR(100),
      "email" VARCHAR(100),
      "pfp" TEXT
    );
  `);
}

export default initializeDatabase;
