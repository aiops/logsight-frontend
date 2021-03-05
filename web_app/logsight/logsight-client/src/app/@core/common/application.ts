import { LogsightUser } from './logsight-user';

export interface Application {
  id: number
  name: string,
  status: string
  user: LogsightUser,
}
