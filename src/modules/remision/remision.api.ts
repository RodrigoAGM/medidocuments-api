import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { RemisionController } from './remision.controller';

const router = Router();
const controller = container.resolve(RemisionController);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.DIGEMID_CHEMIST]),
  controller.handleCreateRemision
);

router.get(
  '/:requirementId',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.DIGEMID_CHEMIST]),
  controller.handleGetById
);

export { router as RemisionApi };
