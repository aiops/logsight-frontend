
export class GetIncidentOverviewRequest {
  startTime: string;
  stopTime: string;

  constructor(startTime: string, stopTime: string) {
    this.startTime = startTime
    this.stopTime = stopTime
  }
}

export class UpdateIncidentStatusRequest {
  incidentId: string;
  incidentStatus: number;

  constructor(incidentId: string, incidentStatus: number) {
    this.incidentId = incidentId
    this.incidentStatus = incidentStatus
  }
}
