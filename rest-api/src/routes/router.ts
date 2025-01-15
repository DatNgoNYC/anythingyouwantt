import { Router, type Request, type Response } from 'express';
import { verifyGoogleIdToken } from '../services/google-auth.js';
import { Database } from '../database/database.js';
import type { CreateOrderRequestBody, CreateUserRequestBody } from '../types/types.js';
import type { Order } from '../database/models/order.js';
import type { User } from '../database/models/user.js';
import { RedisService } from '../services/redis-service.js';

const router = Router();

router.post('/user', async (req: Request, res: Response) => {
  const { googleIdToken } = req.body as CreateUserRequestBody;

  if (!googleIdToken) {
    res.status(400).json({ error: 'googleIdToken is required' });
    return;
  }

  const profile = await verifyGoogleIdToken(googleIdToken);
  const user = await Database.UserModel.getUser(profile.userId);

  if (user) {
    res.status(200).json(user);
  } else {
    const user: User = await Database.UserModel.createUser(profile);

    res.status(201).json(user);
  }
});

router.delete('/user', async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  await Database.UserModel.deleteUser(userId);

  res.status(204).send();
});

router.post('/order', async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  const { title } = req.body as CreateOrderRequestBody;

  if (!title || title.trim() === '') {
    res.status(400).send({ error: "Missing or invalid required field 'title'." });
    return;
  }

  const { orderId } = await Database.OrderModel.createOrder(userId, title);

  const user = await Database.UserModel.getUser(userId);

  if (user) {
    await RedisService.queueOrderToDeliverJob(orderId, title, user.email);
  }

  res.status(201).send({});
});

router.get('/orders', async (req: Request, res: Response) => {
  const userId = res.locals.userId;

  const orders: Order[] = await Database.OrderModel.getOrdersByUserId(userId);

  res.status(200).send(orders);
});

router.delete('/orders/:id', async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  const { id: orderId } = req.params as { id: string };

  const deletedOrder = await Database.OrderModel.deleteByOrderId(userId, orderId);

  if (!deletedOrder) {
    res.status(404).send({ error: 'Order not found or not associated with the user.' });
    return;
  }

  res.status(204).send({});
});

export default router;
