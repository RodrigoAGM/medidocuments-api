import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { TechnicalDocumentController } from './document.controller';

const router = Router();
const controller = container.resolve(TechnicalDocumentController);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.DIGEMID_CHEMIST]),
  controller.handleCreateTechnicalDocument
);

router.get(
  '/:remisionId',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.DIGEMID_CHEMIST, Role.PHARMACY_ASSISTANT]),
  controller.handleGetById
);

export { router as DocumentApi };
