import {Incident} from "./incident-data";

export class GetIncidentOverviewRequest {
  startTime: string;
  stopTime: string;

  constructor(startTime: string, stopTime: string) {
    this.startTime = startTime
    this.stopTime = stopTime
  }
}

export class UpdateIncidentStatusRequest {
  incident: Incident;
  constructor(incident: Incident) {
    this.incident = incident
  }
}
