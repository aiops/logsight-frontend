import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounce, debounceTime, delay } from 'rxjs/operators';
import { PredefinedTime } from '../../common/predefined-time';
import { NbDialogService } from '@nebular/theme';
import { SpecificTemplateModalComponent } from '../specific-template-modal/specific-template-modal.component';
import { CreatePredefinedTimeModal } from '../create-predefined-time-modal/create-predefined-time-modal.component';

@Component({
  selector: 'predefined-times',
  templateUrl: 'predefined-times.component.html',
  styleUrls: ['predefined-times.component.scss'],
})
export class PredefinedTimesComponent {

  constructor() {
  }

  @Input() predefinedTimes: PredefinedTime[] = [];
  @Output() deletePredefinedTime: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectPredefinedTime: EventEmitter<PredefinedTime> = new EventEmitter<PredefinedTime>();

}
