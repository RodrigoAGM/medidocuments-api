import Express, { Application } from 'express';
import Morgan from 'morgan';
import Cors from 'cors';
import { json } from 'body-parser';
import { config } from 'dotenv';
import handleError from './middleware/error.middleware';
import { manager } from './db/mongoose.manager';
import { UserApi } from './modules/user/user.api';
import { AuthApi } from './modules/auth/auth.api';
import { ClaimApi } from './modules/claim/claim.api';
import { HospitalApi } from './modules/hospital/hospital.api';
import { MedicineApi } from './modules/medicine/medicine.api';
import { PrescriptionApi } from './modules/prescription/prescription.api';

export default class App {
  private app: Application;

  // eslint-disable-next-line no-unused-vars
  constructor(private port?: number | string) {
    this.app = Express();
    config();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set('port', this.port || process.env.PORT || 3000);
  }

  middlewares() {
    this.app.use(Morgan('dev'));
    this.app.use(Cors());
  }

  routes() {
    this.app.get('/', json(), (req, res) => {
      res.send('Hello World!');
    });
    this.app.use('/auth', json(), AuthApi);
    this.app.use('/user', json(), UserApi);
    this.app.use('/claim', json(), ClaimApi);
    this.app.use('/hospital', json(), HospitalApi);
    this.app.use('/medicine', json(), MedicineApi);
    this.app.use('/prescription', json(), PrescriptionApi);
    this.app.use(handleError);
  }

  async start() {
    try {
      await manager.connect();
      console.log('Database connected!');

      this.app.listen(this.app.get('port'));
      console.log('App listening to port', this.app.get('port'));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
