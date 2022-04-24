import { IHospital } from './hospital.model';
import { IUser } from './user.model';

export interface ITechnicalDocumentDetail {
  id: string,
  technicalDocumentId: string,
  medicineName: string,
  transportConditions: string,
  packageDescription: string,
  temperatureDescription: string
  type: string
}

export interface ITechnicalDocument {
  id: string,
  date: string,
  type: string
  requirementId: string,
  remisionId: string,
  hospitalId: string,
  digemidChemistId: string,
  hospital?: IHospital,
  digemidChemist?: IUser,
  detail?: ITechnicalDocumentDetail[]
}
