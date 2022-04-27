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

router.put(
  '/:remisionId/confirm',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST]),
  controller.handleConfirmRemision
);

router.get(
  '/:remisionId',
  authenticateToken,
  authenticateRole([
    Role.HOSPITAL_CHEMIST, Role.DIGEMID_CHEMIST, Role.PHARMACY_ASSISTANT,
  ]),
  controller.handleGetById
);

router.get(
  '/lot/:lotNumber',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.PHARMACY_ASSISTANT]),
  controller.handleGetByLotNumber
);

export { router as RemisionApi };
