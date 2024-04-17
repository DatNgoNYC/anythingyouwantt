import { Router } from 'express'
import { AuthController } from '../controller/AuthController'

const router = Router()

router.post('/', AuthController.authenticateUser)

export const AuthRouter = router
