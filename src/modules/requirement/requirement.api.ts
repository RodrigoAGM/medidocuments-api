import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { RequirementController } from './requirement.controller';

const router = Router();
const controller = container.resolve(RequirementController);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST]),
  controller.handleCreateRequirement
);

router.get(
  '/',
  authenticateToken,
  authenticateRole([Role.DIGEMID_CHEMIST]),
  controller.handleGetAll
);

router.get(
  '/self',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.PHARMACY_ASSISTANT]),
  controller.handleGetAllFromHospital
);

router.get(
  '/:requirementId',
  authenticateToken,
  authenticateRole([
    Role.HOSPITAL_CHEMIST, Role.DIGEMID_CHEMIST, Role.PHARMACY_ASSISTANT,
  ]),
  controller.handleGetById
);

export { router as RequirementApi };
