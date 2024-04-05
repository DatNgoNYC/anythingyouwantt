import { Request, Router } from 'express';

import { signInOrCreateUser } from '../controller/controller';

const router = Router();

type BodyType = {
  idToken: string
}

router.post('/', async (req: Request<{}, {}, BodyType>, res) => {
  try {
  } catch {}
});

export const AuthRouter = router;
