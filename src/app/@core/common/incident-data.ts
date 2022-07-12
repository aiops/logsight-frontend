export interface Incident {
  incidentId: any,
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


export interface IncidentGroup {
  incidentId: any,
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
  head: Incident,
  incidents: Incident[]
}

export interface IncidentGroups {
  incidentGroups: IncidentGroup[]
}

