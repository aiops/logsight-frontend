import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounce, debounceTime, delay } from 'rxjs/operators';
import { PredefinedTime } from '../../common/predefined-time';
import { NbDialogService } from '@nebular/theme';
import { SpecificTemplateModalComponent } from '../specific-template-modal/specific-template-modal.component';
import { CreatePredefinedTimeModal } from '../create-predefined-time-modal/create-predefined-time-modal.component';

@Component({
  selector: 'elastic-custom-datepicker',
  templateUrl: 'elastic-custom-datepicker.component.html',
  styleUrls: ['elastic-custom-datepicker.component.scss'],
})
export class ElasticCustomDatepickerComponent {

  constructor(private dialogService: NbDialogService) {
  }

  absoluteDateTime: { startDateTime: string, endDateTime: string }
  relativeDateTime: string = 'now-12h';
  relativeTimeChecked = true;
  absoluteTimeChecked = false;

  @Input() predefinedTimes: PredefinedTime[] = [];
  @Output() search: EventEmitter<any> = new EventEmitter<any>();
  @Output() deletePredefinedTime: EventEmitter<number> = new EventEmitter<number>();
  @Output() savePredefinedTime: EventEmitter<PredefinedTime> = new EventEmitter<PredefinedTime>();

  onAbsoluteDateChange(dateRange: { startDateTime: Date, endDateTime: Date }) {
    this.absoluteDateTime =
      { startDateTime: dateRange.startDateTime.toISOString(), endDateTime: dateRange.endDateTime.toISOString() }
  }

  onRelativeDateChange(value) {
    this.relativeDateTime = value;
  }

  onRelativeTimeChecked(checked) {
    if (checked) {
      this.absoluteTimeChecked = false;
    }
  }

  onAbsoluteTimeChecked(checked) {
    if (checked) {
      this.relativeTimeChecked = false;
    }
  }

  submit() {
    if (this.relativeTimeChecked) {
      this.search.emit({ relativeTimeChecked: this.relativeTimeChecked, relativeDateTime: this.relativeDateTime })
    } else {
      this.search.emit({ absoluteTimeChecked: this.absoluteTimeChecked, absoluteDateTime: this.absoluteDateTime })
    }
  }

  selectPredefinedTime(pt: PredefinedTime) {
    console.log('DAA')
    if (pt.dateTimeType == 'RELATIVE') {
      this.search.emit({ relativeTimeChecked: true, relativeDateTime: pt.startTime })
    } else {
      this.search.emit({
        absoluteTimeChecked: true, absoluteDateTime: {
          startDateTime: pt.startTime,
          endDateTime: pt.endTime
        }
      })
    }
  }

  openSaveTimeDialog() {
    const ref = this.dialogService.open(CreatePredefinedTimeModal, {
      context: {}, dialogClass: 'model-full'
    })
    ref.onClose.subscribe(name => this.saveTime(name))

  }

  saveTime(name: string) {
    let predefinedTime = {
      id: 0,
      name: name,
      startTime: 'now',
      endTime: this.relativeDateTime,
      dateTimeType: this.relativeTimeChecked ? 'RELATIVE' : 'ABSOLUTE'
    }
    this.savePredefinedTime.emit(predefinedTime)
  }
}
