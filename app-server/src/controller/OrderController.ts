import { Request, Response } from 'express'
import { Database } from '../database/db'

export async function getAllOrdersByUserId(req: Request, res: Response): Promise<Response> {
  const userId = req.header('User-Id')

  if (!userId) {
    return res.status(400).json('There is no userId authorization token!')
  }

  try {
    const orders = await Database.getAllOrders(userId)

    return res.status(200).json({ orders })
  } catch (error) {
    return res.status(500).json('A network error on our end. Could not retreive the orders.')
  }
}

async function createAnOrder(req: Request, res: Response) {
  const userId = req.header('User-Id')

  const { title } = req.body

  if (!userId) {
    return res.status(400).json('There is no userId authorization token!')
  }

  try {
    const order = await Database.createOrder(userId, title)

    return res.status(200).json({ order })
  } catch (error) {
    console.error(error)
    return res.status(500).json('A network error on our end. Could not create the order.')
  }
}

export const OrdersController = {
  getAllOrdersByUserId,
  createAnOrder
}
