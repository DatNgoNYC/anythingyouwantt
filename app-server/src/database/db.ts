import pgPromise from 'pg-promise'
import { createUserTable, deleteUser } from './model/User'
import { getAllOrders, createOrder } from './model/Orders'


const dbUrl = process.env.DATABASE_URL as string;
export const db = pgPromise()(dbUrl);



async function initializeDatabase() {
  try {
    createUserTable()
  } catch (error) {
    throw Error
  }
}

import { getUser, createUser } from './model/User'

export const Database = {
  initializeDatabase,
  db,
  getUser,
  createUser,
  deleteUser,
  getAllOrders,
  createOrder
}
