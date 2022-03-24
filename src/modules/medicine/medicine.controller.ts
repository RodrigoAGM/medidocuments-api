import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { clearData } from '../../utils/clear.response';
import { MedicineService } from './medicine.service';

@injectable()
export class MedicineController {
  service: MedicineService

  constructor(service: MedicineService) {
    this.service = service;
  }

  handleGetAllFromHospital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const availableVal = req.query.available;
      const available = !!(availableVal && availableVal === 'true');

      const data = await this.service.getAllFromHospital(req.payload, available);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleCreateMedicine = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body, req.payload);
      res.status(201).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetByIdFromHospital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getByIdFromHospital(req.params.id, req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleSearchFromHospital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.searchFromHospital(req.query.q as string, req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetByLotFromHospital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getByLotFromHospital(Number(req.params.lot), req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.update(req.params.id, req.body, req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }
}
