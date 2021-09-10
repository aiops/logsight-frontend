import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PredefinedTime} from '../../common/predefined-time';

@Component({
  selector: 'predefined-times',
  templateUrl: 'predefined-times.component.html',
  styleUrls: ['predefined-times.component.scss'],
})
export class PredefinedTimesComponent {

  @Input() predefinedTimes: PredefinedTime[] = [];
  @Output() deletePredefinedTime: EventEmitter<PredefinedTime> = new EventEmitter<PredefinedTime>();
  @Output() selectPredefinedTime: EventEmitter<PredefinedTime> = new EventEmitter<PredefinedTime>();

  constructor() {
  }

}
