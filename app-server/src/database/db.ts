import pgPromise from 'pg-promise'
import { createUserTable } from './model/User';

const port = process.env.RDS_PORT ? parseInt(process.env.RDS_PORT, 10) : 5432

const dbConfig = {
  user: process.env.RDS_USERNAME,
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DB_NAME,
  password: process.env.RDS_PASSWORD,
  port: port
}

const db = pgPromise()(dbConfig);

export function initializeDatabase() {
  createUserTable();
}

export default db

