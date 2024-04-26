import { Request, Response } from 'express'
import { Database } from '../database/db'
import { User } from '../database/model/User'

async function getUserInformation(req: Request, res: Response): Promise<Response> {
  const userId = req.header('User-Id')

  if (!userId) {
    return res.status(400).json('There is no userId authorization token!')
  }

  try {
    const user: User | null = await Database.getUser(userId)

    if (user) {
      const { name, email, pfp } = user
      return res.status(200).json({ name, email, pfp })
    } else {
      return res.status(500).json("We can't find that user in our system right now.")
    }
  } catch {
    return res.status(500).json('A network error on our end!')
  }
}

async function deleteUserAccount(req: Request, res: Response): Promise<Response> {
  const userId = req.header('User-Id')

  if (!userId) {
    return res.status(400).json('There is no userId authorization token!')
  }

  try {
    const user: User = await Database.deleteUser(userId)

    const { name, email, pfp } = user
    return res.status(200).json({ name, email, pfp })
  } catch {
    return res.status(500).json('A network error on our end!')
  }
}

export const UserController = {
  getUserInformation,
  deleteUserAccount
}
