export interface LogsightUser {
  id: number
  email: string,
  key: string,
  dateCreated: Date,
  activationDate: Date,
  activated: Boolean,
  hasPaid: Boolean
  availableData: number,
  usedData: number
}
