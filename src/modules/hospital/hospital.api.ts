import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { HospitalController } from './hospital.controller';

const router = Router();
const controller = container.resolve(HospitalController);

router.get(
  '/',
  authenticateToken,
  controller.handleGetAll
);

router.get(
  '/:id',
  authenticateToken,
  controller.handleGetById
);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.ADMIN]),
  controller.handleCreateHospital
);

export { router as HsopitalApi };
