import {  Router } from 'express'
import { UserController } from '../controller/UserController'
import { OrdersController } from '../controller/OrderController'

const router = Router()

router.get('/user', UserController.getUserInformation) 
router.delete('/user', UserController.deleteUserAccount)

router.get('/user/orders', OrdersController.getAllOrdersByUserId) 
router.get('/user/orders', OrdersController.createAnOrder) 


export const ApiRouter = router
