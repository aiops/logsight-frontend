export interface TopKIncident {
  indexName: string,
  timestamp: string,
  newTemplates: string,
  semanticAD: string,
  countAD: string,
  startTimestamp: Date,
  stopTimestamp: Date,
  totalScore: number,
}
