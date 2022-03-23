import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from './auth.controller';

const router = Router();
const controller = container.resolve(AuthController);

router.post(
  '/signin',
  controller.handleSignIn
);

router.delete(
  '/signout/:refreshToken',
  controller.handleSignOut
);

router.post(
  '/extend-token',
  controller.handleRefreshToken
);

export { router as AuthApi };
