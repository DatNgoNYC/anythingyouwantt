import { Request, Router } from 'express';
import { signInOrCreateUser } from '../controller/controller';

const router = Router();

type BodyType = {
  idToken: string;
};

router.post('/', async (req: Request<{}, {}, BodyType>, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'idToken is required.' });
    }

    const uniqueId = await signInOrCreateUser(idToken);
    return res.status(200).json({ uniqueId });
  } catch {
    return res.status(500).json({ error: 'Could not complete the request.' });
  }
});

export const AuthRouter = router;
