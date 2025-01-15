import { OrderModel } from '../models/order.js';
import { UserModel } from '../models/user.js';

/**
 * Initialize the database by creating the tables.
 */
export const initializeDatabase = async () => {
  await UserModel.createUserTable();
  await OrderModel.createOrderTable();
};
