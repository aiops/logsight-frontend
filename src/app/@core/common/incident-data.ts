export interface IncidentData {
  incidentId: any,
  similarIncidents: any,
  timestamp: any,
  tags: any,
  tagKeys: any,
  status: any,
  severity: any,
  message: any,
  risk: any,
  countAddedState: any,
  countLevelFault: any,
  countSemanticAnomaly: any,
  countMessages: any,
  countStates: any,
}

export interface ListOverviewIncidentData {
  listIncident: OverviewIncidentData[]
}

export interface OverviewIncidentData {
  incidentId: string,
  source: IncidentData
}

export interface IssueCountVerificationData {
  status: number,
  count: number
}

