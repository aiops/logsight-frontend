import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'specific-template-modal',
  templateUrl: 'specific-template-modal.component.html',
  styleUrls: ['specific-template-modal.component.scss'],
})
export class SpecificTemplateModalComponent {

  @Input() data: any;
  @Input() type: any;
  @Input() options: string;

  constructor(protected ref: NbDialogRef<SpecificTemplateModalComponent>) {
  }

  dismiss() {
    this.ref.close();
  }
}
