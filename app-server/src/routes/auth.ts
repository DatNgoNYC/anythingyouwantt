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
  } catch (error) {
    
    console.error(error); 

    const errorMessage = error instanceof Error ? error.message : 'Could not complete the authentication request.';
    return res.status(500).json({ error: errorMessage });  }
});

export const AuthRouter = router;
