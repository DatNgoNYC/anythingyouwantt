import { Router } from 'express';

const router = Router();

router.get('/:userId', getUser(req, res));
