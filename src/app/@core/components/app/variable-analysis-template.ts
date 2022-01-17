import { Component, Input, OnInit } from '@angular/core';
import { VariableAnalysisHit } from '../../common/variable-analysis-hit';
import { MessagingService } from '../../service/messaging.service';
import { HitParam } from '../../common/hit-param';

@Component({
  template: `
    <div style="float: left">
      <span *ngFor="let pt of parsedTemplates">
      <span >{{pt.parsedTemplate}}</span>
      <span class="template" style="color: #ff247c"
            (click)="selectTemplate(pt.template, pt.param, pt.paramValue, pt.applicationId)">{{ pt.paramValue }}</span>
    </span>
    </div>
  `
})
export class VariableAnalysisTemplate implements OnInit {
  constructor(private messagingService: MessagingService) {
  }

  ngOnInit(): void {
    this.getResult();
  }

  @Input() data: VariableAnalysisHit;
  parsedTemplates: { template: string, parsedTemplate: string, param: string, paramValue: string, applicationId: number }[] = []

  selectTemplate(template: string, param: string, paramValue: string, applicationId: number) {
    const item = { template: template, param, paramValue, applicationId }
    this.messagingService.sendVariableAnalysisTemplate(item)
  }

  getResult() {
    let item = this.data;
    let templates = item.template.split('<*>')
    for (let i = 0; i < templates.length; i++) {
      if (templates[i] == '' && i == item.params.length - 1) {
      } else {
        const paramValue = this.getValueForParam(item.params, `param_${i}`)
        this.parsedTemplates.push(
          {
            template: item.template,
            parsedTemplate: templates[i],
            param: `param_${i}`,
            paramValue: paramValue,
            applicationId: item.applicationId
          });
      }
    }
  }

  getValueForParam(params: HitParam[], param) {
    const res = params.find(it => it.key == param)
    return res ? res.value : ''
  }
}


