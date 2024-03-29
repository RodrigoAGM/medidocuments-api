import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { PrescriptionController } from './prescription.controller';

const router = Router();
const controller = container.resolve(PrescriptionController);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.DOCTOR]),
  controller.handleCreate
);

router.get(
  '/',
  authenticateToken,
  authenticateRole([Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST]),
  controller.handleGetAllFromHospital
);

router.get(
  '/self',
  authenticateToken,
  authenticateRole([Role.PATIENT, Role.DOCTOR]),
  controller.handleGetAllSelf
);

router.post(
  '/attend/:id',
  authenticateToken,
  authenticateRole([Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST]),
  controller.handleAttendPrescription
);

router.get(
  '/:id',
  authenticateToken,
  authenticateRole([Role.PATIENT, Role.DOCTOR, Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST]),
  controller.handleGetById
);

router.get(
  '/patient/:dni',
  authenticateToken,
  authenticateRole([Role.DOCTOR, Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST]),
  controller.handleGetFromPatient
);

router.get(
  '/lot/:lotNumber',
  authenticateToken,
  authenticateRole([Role.PATIENT, Role.PHARMACY_ASSISTANT, Role.HOSPITAL_CHEMIST]),
  controller.handleGetByMedicineLot
);

export { router as PrescriptionApi };
