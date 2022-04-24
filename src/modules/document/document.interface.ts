export interface ITechnicalDocumentCreateDetail {
  medicineName: string,
  transportConditions: string,
  packageDescription: string,
  temperatureDescription: string
}

export interface ITechnicalDocumentCreate {
  digemidChemistId: string
  requirementId: string
  remisionId: string
  hospitalId: string
  detail: ITechnicalDocumentCreateDetail[]
}
