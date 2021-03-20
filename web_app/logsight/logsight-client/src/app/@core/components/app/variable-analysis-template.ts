import { Component, EventEmitter, Input, Output } from '@angular/core';

import { VariableAnalysisHit } from '../../common/variable-analysis-hit';

@Component({
  template: `
    <p (click)='selectTemplate(data.template)'>{{data.template}}
  `
})
export class VariableAnalysisTemplate {
  @Input() data: VariableAnalysisHit;

  selectTemplate(test) {
    console.log(test)
  }
}


