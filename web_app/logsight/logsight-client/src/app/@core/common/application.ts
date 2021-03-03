import { LogsightUser } from './logsight-user';

export interface Application {
  id: number
  name: string,
  user: LogsightUser,
}
