import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'range-date-time',
  templateUrl: 'range-date-time.component.html',
  styleUrls: ['range-date-time.component.scss'],
})
export class RangeDateTimeComponent implements OnInit {

  dateForm = new FormGroup({
    dateRange: new FormControl(),
  });

  @Input() disabled: boolean
  @Output() change: EventEmitter<{ startDateTime: Date, endDateTime: Date }> = new EventEmitter()

  constructor() {
  }

  ngOnInit(): void {
    this.dateForm.controls['dateRange'].valueChanges.subscribe(change => {
      this.changeDate(change[0], change[1])
    })
  }

  changeDate(startDateTime: Date, endDateTime: Date,) {
    this.change.emit({ startDateTime, endDateTime })
  }

}
