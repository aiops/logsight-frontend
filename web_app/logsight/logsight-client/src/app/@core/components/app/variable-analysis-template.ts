import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { VariableAnalysisHit } from '../../common/variable-analysis-hit';
import { MessagingService } from '../../service/messaging.service';
import { HitParam } from '../../common/hit-param';

@Component({
  template: `
    <div style="float: left">
    <span *ngFor="let pt of parsedTemplates">
      <span style="color: white">{{pt.parsedTemplate}}</span>
      <span class="template" style="color: #ffca57"
            (click)="selectTemplate(pt.template, pt.param, pt.paramValue)">{{pt.paramValue}}</span>
    </span>
    </div>
  `
})
export class VariableAnalysisTemplate implements OnInit {
  constructor(private messagingService: MessagingService) {
  }

  ngOnInit(): void {
    const result = this.getResult()
  }

  @Input() data: VariableAnalysisHit;
  parsedTemplates: { template: string, parsedTemplate: string, param: string, paramValue: string }[] = []

  selectTemplate(template: string, param: string, paramValue: string) {
    const item = { template: template, param, paramValue }
    this.messagingService.sendVariableAnalysisTemplate(item)
  }

  getResult() {
    let item = this.data;
    let templates = item.template.split('<*>')
    for (let i = 0; i < item.params.length; i++) {
      if (templates[i] == '' && i == item.params.length - 1) {
      } else {
        const paramValue = this.getValueForParam(item.params, `param_${i}`)
        this.parsedTemplates.push(
          { template: item.template, parsedTemplate: templates[i], param: `param_${i}`, paramValue: paramValue });
      }
    }
  }

  getValueForParam(params: HitParam[], param) {
    return params.find(it => it.key == param).value
  }
}


