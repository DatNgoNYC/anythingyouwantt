import { Request, Response, Router } from 'express'
import { getThingsByUserId } from '../controller/controller'
import { gerror } from 'console'
import { createThing } from '../database/model/Thing'

const router = Router()

type ThingsGetRequest = Request & {
  headers: {
    userId?: string
  }
}

router.get('/user/things', async (req: ThingsGetRequest, res: Response) => {
  const userId = req.headers.userId

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required in the header to access the api.' })
  }

  await getThingsByUserId(userId)
    .then((things) => {
      return res.status(200).json({ data: things, message: 'Things wanted successfully retreived.' })
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : 'error while trying to get things')
      return res.status(500).json({ error: 'Could not get the things the user wanted.' })
    })
})

type ThingsPostRequest = Request & {
  headers: {
    userId?: string
  }
  body: {
    title: string
  }
}

router.post('/user/things', async (req: ThingsPostRequest, res: Response) => {
  const userId = req.headers.userId

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required in the header to access the api.' })
  }

  await createThing(userId, req.body.title)
})

export const ApiRouter = router
