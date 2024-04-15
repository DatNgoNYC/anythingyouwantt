import { Request, Router } from 'express'
import { signInOrCreateUser } from '../controller/controller'

const router = Router()

type BodyType = {
  idToken: string
}

router.post('/', async (req: Request<{}, {}, BodyType>, res) => {
  const { idToken } = req.body

  if (!idToken) {
    return res.status(400).json({ error: 'idToken is required.' })
  }

  try {
    const uniqueId = await signInOrCreateUser(idToken)

    return res.status(200).json({ uniqueId })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)

      return res.status(500).json({
        error:
          'Could not complete the authentication request: ' + error.message,
      })
    } else {
      console.error('Non-standard error object:', error)

      return res.status(500).json({
        error: 'Unknown error occurred during authentication.',
      })
    }
  }
})

export const AuthRouter = router
