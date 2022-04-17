export interface IRequirementCreateDetail {
  detail: string,
  amount: number,
  meassurement: string
}

export interface IRequirementCreate {
  chemistId: string,
  hospitalId: string,
  detail: IRequirementCreateDetail[]
}
