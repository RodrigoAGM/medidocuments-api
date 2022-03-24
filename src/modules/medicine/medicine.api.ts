import { Router } from 'express';
import { container } from 'tsyringe';
import { authenticateToken } from '../../middleware/jwt.middleware';
import { authenticateRole } from '../../middleware/role.middleware';
import { Role } from '../../types/enums';
import { MedicineController } from './medicine.controller';

const router = Router();
const controller = container.resolve(MedicineController);

router.get(
  '/',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.PHARMACY_ASSISTANT, Role.DOCTOR]),
  controller.handleGetAllFromHospital
);

router.get(
  '/search',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.PHARMACY_ASSISTANT]),
  controller.handleSearchFromHospital
);

router.get(
  '/:id',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.PHARMACY_ASSISTANT, Role.DOCTOR]),
  controller.handleGetByIdFromHospital
);

router.get(
  '/lot/:lot',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST, Role.PHARMACY_ASSISTANT, Role.DOCTOR]),
  controller.handleGetByLotFromHospital
);

router.post(
  '/',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST]),
  controller.handleCreateMedicine
);

router.put(
  '/:id',
  authenticateToken,
  authenticateRole([Role.HOSPITAL_CHEMIST]),
  controller.handleUpdate
);

export { router as MedicineApi };
