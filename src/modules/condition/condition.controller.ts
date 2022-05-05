import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { clearData } from '../../utils/clear.response';
import { ConditionService } from './condition.service';

@injectable()
export class ConditionController {
  service: ConditionService

  constructor(service: ConditionService) {
    this.service = service;
  }

  handleGetAllFromHospital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAllFromHospital(req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleCreateCondition = async (req: Request, res: Response, next: NextFunction) => {
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
}
