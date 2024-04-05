// import pool from '../database';

// // Function to fetch a user by ID
// export const getUserById = async (userId: number) => {
//   try {
//     const userQuery = 'SELECT * FROM users WHERE id = $1';
//     const userResult = await pool.query(userQuery, [userId]);
    
//     // Assuming there's only one user with this ID
//     if (userResult.rows.length > 0) {
//       return userResult.rows[0];
//     } else {
//       throw new Error('User not found');
//     }
//   } catch (err) {
//     throw new Error(`Error fetching user: ${err.message}`);
//   }
// };

// // Function to fetch orders for a specific user
// export const getUserOrders = async (userId: number) => {
//   try {
//     const ordersQuery = 'SELECT * FROM user_orders WHERE user_id = $1';
//     const ordersResult = await pool.query(ordersQuery, [userId]);
//     return ordersResult.rows; // This could be an array of orders
//   } catch (err) {
//     throw new Error(`Error fetching user orders: ${err.message}`);
//   }
// };

// // Optionally, a function to fetch both user and their orders together
// export const getUserAndOrders = async (userId: number) => {
//   try {
//     const user = await getUserById(userId);
//     const orders = await getUserOrders(userId);
//     return { user, orders };
//   } catch (err) {
//     throw new Error(`Error fetching user and orders: ${err.message}`);
//   }
// };