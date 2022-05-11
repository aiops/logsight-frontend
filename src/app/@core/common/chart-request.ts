import {ChartConfig} from "./chart-config";

export class ChartRequest {
  chartConfig: ChartConfig;
  applicationId: string;

  constructor(chartConfig: ChartConfig, applicationId: string) {
    this.chartConfig = chartConfig;
    this.applicationId = applicationId;
  }

}
