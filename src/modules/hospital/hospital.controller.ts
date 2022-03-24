import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { clearData } from '../../utils/clear.response';
import { HospitalService } from './hospital.service';

@injectable()
export class HospitalController {
  service: HospitalService

  constructor(service: HospitalService) {
    this.service = service;
  }

  handleGetAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAll();
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleCreateHospital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getById(req.params.id);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }
}
