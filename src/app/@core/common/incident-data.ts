export interface IncidentData {
  timestamp: any,
  timestampStart: any,
  timestampEnd: any,
  incidentId: any,
  tags: any,
  status: any,
  severity: any,
  message: any,
  risk: any,
  added_states: any,
  level_faults: any,
  semantic_anomalies: any,
  count_messages: any,
  count_states: any,
  data: any[],
}

export interface ListOverviewIncidentData {
  listIncident: OverviewIncidentData
}

export interface OverviewIncidentData {
  _id: string,
  _source: IncidentData
}

export interface IssueCountVerificationData {
  status: number,
  count: number
}

