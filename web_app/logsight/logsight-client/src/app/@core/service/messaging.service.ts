import { Observable, Subject } from 'rxjs';
import { VariableAnalysisHit } from '../common/variable-analysis-hit';

export class MessagingService {
  constructor() {
  }

  private variableAnalysisTemplateSelected = new Subject<any>();

  sendVariableAnalysisTemplate(item: { template: string, param: string, paramValue: string }) {
    this.variableAnalysisTemplateSelected.next({ item });
  }

  getVariableAnalysisTemplate(): Observable<{ template: string, param: string, paramValue: string }> {
    return this.variableAnalysisTemplateSelected.asObservable();
  }
}
