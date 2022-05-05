import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { clearData } from '../../utils/clear.response';
import { SignatureService } from './signature.service';

@injectable()
export class SignatureController {
  service: SignatureService

  constructor(service: SignatureService) {
    this.service = service;
  }

  handleCreateSignature = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.payload, req.body);
      res.status(201).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetSelfSignature = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getSelf(req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }
}
