import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'relative-time',
  templateUrl: 'relative-time.component.html',
  styleUrls: ['relative-time.component.scss'],
})
export class RelativeTimeComponent implements OnInit {
  measurements = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years']

  formGroup = new FormGroup({
    lastNext: new FormControl('Last', Validators.required),
    measurementNumber: new FormControl('1', Validators.required),
    measurement: new FormControl('minutes', Validators.required),
  });

  ngOnInit(): void {
  }

  lastNextChange(lastNext) {
    this.formGroup.controls['lastNext'].setValue(lastNext)
  }
}
