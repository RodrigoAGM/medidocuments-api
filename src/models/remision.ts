import { IHospital } from './hospital.model';
import { IUser } from './user.model';

export interface IRemisionDetail {
  id: string,
  medicineName: string,
  medicineLotNumber: number,
  meassurement: string,
  remisionId: string,
  amount: number,
  type: string
}

export interface IRemision {
  id: string,
  digemidChemistId: string,
  date: string,
  hospitalId: string,
  hospital?: IHospital,
  digemidChemist?: IUser,
  requirementId: string,
  type: string
  detail?: IRemisionDetail[]
}
