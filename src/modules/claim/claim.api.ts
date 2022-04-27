import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { ClaimController } from './claim.controller';

const router = Router();
const controller = container.resolve(ClaimController);

router.get(
  '/',
  authenticateToken,
  authenticateRole([Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST]),
  controller.handleGetAll
);

router.get(
  '/self',
  authenticateToken,
  authenticateRole([Role.PATIENT]),
  controller.handleGetSelfClaims
);

router.get(
  '/:id',
  authenticateToken,
  authenticateRole([Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST, Role.PATIENT]),
  controller.handleGetById
);

router.put(
  '/:id',
  authenticateToken,
  authenticateRole([Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST]),
  controller.handleAttendClaim
);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.PATIENT]),
  controller.handleCreateClaim
);

router.get(
  '/lot/:lotNumber',
  authenticateToken,
  authenticateRole([Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST, Role.PATIENT]),
  controller.handleGetClaimsByLotNumber
);

export { router as ClaimApi };
