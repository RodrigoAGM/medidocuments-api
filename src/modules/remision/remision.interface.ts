export interface IRemisionCreateDetail {
  medicineName: string,
  medicineLotNumber: number,
  amount: number,
  meassurement: string
}

export interface IRemisionCreate {
  digemidChemistId: string,
  hospitalId: string,
  requirementId: string,
  digemidSignature: string,
  detail: IRemisionCreateDetail[]
}
