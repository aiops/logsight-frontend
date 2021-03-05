export interface TopKIncident {
  indexName: string
  firstLog: string,
  lastLog: string,
  startTimestamp: Date,
  stopTimestamp: Date,
  totalScore: number,
}
