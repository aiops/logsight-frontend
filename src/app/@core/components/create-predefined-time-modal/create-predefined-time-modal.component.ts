import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { NbCardModule } from '@nebular/theme';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'create-predefined-time-modal',
  templateUrl: 'create-predefined-time-modal.component.html',
  styleUrls: ['create-predefined-time-modal.component.scss'],
})
export class CreatePredefinedTimeModal {

  predefinedTimeForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(protected ref: NbDialogRef<CreatePredefinedTimeModal>) {
  }

  dismiss() {
    this.ref.close();
  }

  save() {
    this.ref.close(this.predefinedTimeForm.controls['name'].value)
  }
}
