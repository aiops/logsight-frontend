export class ChartConfig {
    type: string;
    startTime: string;
    stopTime: string;
    feature: string;
    indexType: string;
    timeZone: string;
    numElements: number;

  constructor(type: string, startTime: string, stopTime: string, feature: string, indexType: string, timeZone: string, numElements: number = 5) {
    this.type = type;
    this.startTime = startTime;
    this.stopTime = stopTime;
    this.feature = feature;
    this.indexType = indexType;
    this.timeZone = timeZone;
    this.numElements = numElements;
  }
}
