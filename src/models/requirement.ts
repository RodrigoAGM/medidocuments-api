import { IHospital } from './hospital.model';
import { ISignature } from './signature.model';
import { IUser } from './user.model';

export interface IRequirementDetail {
  amount: number,
  detail: string,
  id: string,
  meassurement: string,
  requirementId: string,
  type: string
}

export interface IRequirement {
  chemistId: string,
  date: string,
  confirmed: boolean,
  hospitalId: string,
  hospital?: IHospital,
  chemist?: IUser,
  id: string,
  chemistSignature?: string | ISignature
  remisionId?: string,
  technicalDocumentId?: string,
  type: string
  detail?: IRequirementDetail[]
}
