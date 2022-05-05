import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { ConditionController } from './condition.controller';

const router = Router();
const controller = container.resolve(ConditionController);

router.get(
  '/',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.PHARMACY_ASSISTANT]),
  controller.handleGetAllFromHospital
);

router.get(
  '/:id',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.PHARMACY_ASSISTANT]),
  controller.handleGetByIdFromHospital
);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.PHARMACY_ASSISTANT]),
  controller.handleCreateCondition
);

export { router as ConditionApi };
