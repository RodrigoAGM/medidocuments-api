import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { UserController } from './user.controller';

const router = Router();
const controller = container.resolve(UserController);

// Admin routes
router.get(
  '/:id',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  controller.handleGetUser
);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  controller.handleCreateUser
);

export { router as UserApi };
