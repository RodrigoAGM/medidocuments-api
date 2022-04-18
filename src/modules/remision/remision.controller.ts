import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { Role } from '../../types/enums';
import { clearData } from '../../utils/clear.response';
import { RemisionService } from './remision.service';

@injectable()
export class RemisionController {
  service: RemisionService

  constructor(service: RemisionService) {
    this.service = service;
  }

  handleCreateRemision = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.payload, req.body);
      res.status(201).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payload } = req;

      let data;

      if (payload.role === Role.DIGEMID_CHEMIST) {
        data = await this.service.getById(req.payload, req.params.remisionId);
      } else {
        data = await this.service.getByIdFromHospital(req.payload, req.params.remisionId);
      }

      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }
}
