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
  hospitalId: string,
  id: string,
  remisionId?: string,
  type: string
  detail?: IRequirementDetail[]
}
