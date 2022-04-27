import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { PrescriptionStatus } from '../../types/enums';
import { clearData } from '../../utils/clear.response';
import { PrescriptionService } from './prescription.service';

@injectable()
export class PrescriptionController {
  service: PrescriptionService

  constructor(service: PrescriptionService) {
    this.service = service;
  }

  handleCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body, req.payload);
      res.status(201).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetAllFromHospital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        dni, dateFrom, dateTo,
      } = req.query;

      const data = await this.service.getAllFromHospital(
        req.payload.id,
        (dni as string),
        (dateFrom as string),
        (dateTo as string),
      );
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetAllSelf = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAllSelf(req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getById(req.params.id, req.payload);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetFromPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.query;
      const { dni } = req.params;
      const data = await this.service.getFromPatient(
        dni as string, req.payload, status as PrescriptionStatus
      );
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleAttendPrescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { detail } = req.body;
      const data = await this.service.attendPrescription(req.payload, id, detail);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetByMedicineLot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAllByMedicineLot(req.payload, Number(req.params.lotNumber ?? '-1'));
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }
}
