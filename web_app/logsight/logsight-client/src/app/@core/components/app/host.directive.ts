// tslint:disable: directive-selector
import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[adHost]',
})
export class HostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

