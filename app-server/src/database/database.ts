import { Pool } from 'pg'

const rdsPort = process.env.RDS_PORT ? parseInt(process.env.RDS_PORT, 10) : 5432

export const pool = new Pool({
  user: process.env.RDS_USERNAME,
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DB_NAME,
  password: process.env.RDS_PASSWORD,
  port: rdsPort
})


