import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from './auth.controller';

const router = Router();
const controller = container.resolve(AuthController);

router.post(
  '/signin',
  controller.handleSignIn
);

export { router as AuthApi };
