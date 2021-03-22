import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { HostDirective } from './host.directive';
import { VariableAnalysisHit } from '../../common/variable-analysis-hit';
import { VariableAnalysisTemplate } from './variable-analysis-template';

@Component({
  selector: 'app-ad-banner',
  template: `
    <ng-template adHost></ng-template>
  `
})
export class VariableAnalysisTemplateResolver implements OnInit, OnDestroy {
  @Input() row: VariableAnalysisHit;
  currentAdIndex = -1;
  @ViewChild(HostDirective, { static: true }) adHost: HostDirective;
  interval: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  loadComponent() {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VariableAnalysisTemplate);

    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<VariableAnalysisTemplate>(componentFactory);
    componentRef.instance.data = this.row;
  }
}
