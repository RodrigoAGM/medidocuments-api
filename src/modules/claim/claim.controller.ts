import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { clearData } from '../../utils/clear.response';
import { ClaimService } from './claim.service';

@injectable()
export class ClaimController {
  service: ClaimService

  constructor(service: ClaimService) {
    this.service = service;
  }

  handleGetAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        status, dni, dateFrom, dateTo,
      } = req.query;

      const data = await this.service.getAll(
        req.payload.id,
        (status as string),
        (dni as string),
        (dateFrom as string),
        (dateTo as string),
      );
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetSelfClaims = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getSelfClaims(req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleCreateClaim = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body, req.payload);
      res.status(201).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getById(req.params.id, req.payload.id);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleAttendClaim = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comments, status } = req.body;
      const { id } = req.params;
      const data = await this.service.atendClaim(req.payload, id, comments, status);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }
}
