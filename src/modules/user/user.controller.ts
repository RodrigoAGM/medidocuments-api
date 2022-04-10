import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { clearData } from '../../utils/clear.response';
import { UserService } from './user.service';

@injectable()
export class UserController {
  service: UserService

  constructor(service: UserService) {
    this.service = service;
  }

  handleGetSelf = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.payload;
      const data = await this.service.getById(id);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetByDni = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.payload;
      const { dni } = req.params;
      const data = await this.service.getByDni(id, dni);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleGetUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.service.getById(id);
      res.status(200).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }

  handleCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).send(clearData(data));
    } catch (error) {
      next(error);
    }
  }
}
