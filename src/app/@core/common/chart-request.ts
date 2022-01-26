import {DataSourceConfig} from "./data-source-config";
import {ChartConfig} from "./chart-config";

export class ChartRequest {
  chartConfig: ChartConfig;
  dataSource: DataSourceConfig;
  applicationId: number;

  constructor(chartConfig: ChartConfig, dataSource: DataSourceConfig, applicationId: number) {
    this.chartConfig = chartConfig;
    this.dataSource = dataSource;
    this.applicationId = applicationId;
  }

}
