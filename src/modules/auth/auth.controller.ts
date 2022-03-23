import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { clearData } from '../../utils/clear.response';
import { AuthService } from './auth.service';

@injectable()
export class AuthController {
  private service: AuthService

  constructor(authService: AuthService) {
    this.service = authService;
  }

  handleSignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const data = await this.service.signIn(username, password);

      res.status(200).send(clearData(data));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
