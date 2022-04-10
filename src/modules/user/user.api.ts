import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { UserController } from './user.controller';

const router = Router();
const controller = container.resolve(UserController);

router.get(
  '/self',
  authenticateToken,
  controller.handleGetSelf
);

router.get(
  '/dni/:dni',
  authenticateToken,
  authenticateRole([Role.DOCTOR, Role.HOSPITAL_CHEMIST, Role.PHARMACY_ASSISTANT]),
  controller.handleGetByDni
);

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
