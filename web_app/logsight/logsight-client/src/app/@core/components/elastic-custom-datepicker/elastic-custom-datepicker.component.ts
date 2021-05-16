import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounce, debounceTime, delay } from 'rxjs/operators';

@Component({
  selector: 'elastic-custom-datepicker',
  templateUrl: 'elastic-custom-datepicker.component.html',
  styleUrls: ['elastic-custom-datepicker.component.scss'],
})
export class ElasticCustomDatepickerComponent {

  absoluteDateTime: { startDateTime: Date, endDateTime: Date }
  relativeDateTime: string = 'now-12h';
  relativeTimeChecked = true;
  absoluteTimeChecked = false;

  @Output() search: EventEmitter<any> = new EventEmitter<any>()

  onAbsoluteDateChange(dateRange: { startDateTime: Date, endDateTime: Date }) {
    this.absoluteDateTime = dateRange
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
}
