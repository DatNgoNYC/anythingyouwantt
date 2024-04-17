import { Request, Response } from 'express'
import { Database } from '../database/db'

export async function getAllOrdersByUserId(req: Request, res: Response): Promise<Response> {
  const userId = req.header('user-id')

  if (!userId) {
    return res.status(400).json({ success: false, error: 'There is no userId authorization token!' })
  }

  try {
    const orders = await Database.getAllOrders(userId)

    return res.json({ success: true, data: { orders: orders } })
  } catch (error) {
    return res.status(500).json({ success: false, error: 'A network error on our end! Could not retreive the orders.' })
  }
}

interface OrderPostRequestBody {
  title: string
}

type OrderPostRequest = Request<Record<string, never>, Record<string, never>, OrderPostRequestBody>

async function createAnOrder(req: OrderPostRequest, res: Response) {
  const userId = req.header('user-id')
  const { title } = req.body

  if (!userId) {
    return res.status(400).json({ success: false, error: 'There is no userId authorization token!' })
  }

  try {
    const order = await Database.createOrder(userId, title)

    return res.json({ success: true, data: { order: order } })
  } catch (error) {
    return res.status(500).json({ success: false, error: 'A network error on our end! Could not create the order.' })
  }
}

export const OrdersController = {
  getAllOrdersByUserId,
  createAnOrder
}
