export class ChartConfig {
    type: string;
    library: string;
    startTime: string;
    stopTime: string;
    feature: string;

  constructor(type: string, library: string, startTime: string, stopTime: string, feature: string) {
    this.type = type;
    this.library = library;
    this.startTime = startTime;
    this.stopTime = stopTime;
    this.feature = feature;
  }
}
