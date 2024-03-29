import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { Role } from '../../types/enums';
import { clearData } from '../../utils/clear.response';
import { RequirementService } from './requirement.service';

@injectable()
export class RequirementController {
  service: RequirementService

  constructor(service: RequirementService) {
    this.service = service;
  }

  handleCreateRequirement = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.payload, req.body);
      res.status(201).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAll(req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetAllFromHospital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAllFromHospital(req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payload } = req;

      let data;

      if (payload.role === Role.DIGEMID_CHEMIST) {
        data = await this.service.getById(req.payload, req.params.requirementId);
      } else {
        data = await this.service.getByIdFromHospital(req.payload, req.params.requirementId);
      }

      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }
}
