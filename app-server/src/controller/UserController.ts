import { Request, Response } from 'express'
import { Database } from '../database/db'

async function getUserInformation(req: Request, res: Response): Promise<Response> {
  const userId = req.header('user-id')

  if (!userId) {
    return res.status(400).json({ success: false, error: 'There is no userId authorization token!' })
  }

  try {
    const user = await Database.getUser(userId)

    if (user) {
      return res.status(200).json({ success: true, data: user })
    } else {
      return res
        .status(500)
        .json({ success: false, error: "We got the userId, but we don't seem to have that user in our system." })
    }
  } catch {
    return res.status(500).json({ success: false, error: 'A network error on our end!' })
  }
}

async function deleteUserAccount(req: Request, res: Response): Promise<Response> {
  const userId = req.header('user-id')

  if (!userId) {
    return res.status(400).json({ success: false, error: 'There is no userId authorization token!' })
  }

  try {
    const user = await Database.deleteUser(userId)

    if (user) {
      return res.status(200).json({ success: true, data: user })
    } else {
      return res
        .status(500)
        .json({ success: false, error: "We got the userId, but we don't seem to have that user in our system." })
    }
  } catch {
    return res.status(500).json({ success: false, error: 'A network error on our end!' })
  }
}

export const UserController = {
  getUserInformation,
  deleteUserAccount
}
