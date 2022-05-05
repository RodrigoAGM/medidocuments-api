import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { SignatureController } from './signature.controller';

const router = Router();
const controller = container.resolve(SignatureController);

router.get(
  '/self',
  authenticateToken,
  authenticateRole([
    Role.DIGEMID_CHEMIST, Role.DOCTOR, Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST,
  ]),
  controller.handleGetSelfSignature
);

router.put(
  '/',
  authenticateToken,
  authenticateRole([
    Role.DIGEMID_CHEMIST, Role.DOCTOR, Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST,
  ]),
  controller.handleCreateSignature
);

export { router as SignatureApi };
