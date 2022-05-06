import { IHospital } from './hospital.model';
import { ISignature } from './signature.model';
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
  observations: string,
  hospital?: IHospital,
  chemistSignature?: string | ISignature
  digemidSignature?: string | ISignature
  digemidChemist?: IUser,
  requirementId: string,
  type: string
  detail?: IRemisionDetail[]
}
