// controller will use database as Database.

import { OrderModel } from './models/order.js';
import { UserModel } from './models/user.js';
import { initializeDatabase } from './utils/init.js';

export const Database = {
  UserModel,
  OrderModel,
  initializeDatabase,
};
