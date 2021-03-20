import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[adHost]',
})
export class TemplatesDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
