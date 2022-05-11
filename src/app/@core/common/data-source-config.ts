export class DataSourceConfig {
  type: string;
  index: string;

  constructor(type: string, index: string) {
    this.type = type;
    this.index = index;
  }
}
