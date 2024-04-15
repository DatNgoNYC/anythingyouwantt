import { Request, Response, Router } from 'express'

const router = Router()

type ThingsRequest = Request & {
  headers: {
    userId?: string;
  }
}

router.get('/user/things', async (req: ThingsRequest, res) => {
  // need to extract the userId from the header
  // getAllThings( userId: string ) => controller will user database to create thing

})

router.post('/user/things', async (req: Request, res: Response) => {
  // need to extract the userId from the header
  // createThing( thing: Thing, userId: string ) => controller will user database to create thing
})