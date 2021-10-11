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
    relativeDateTime: string = 'now-720m';
    relativeTimeChecked = true;
    absoluteTimeChecked = false;

    @Output() search: EventEmitter<any> = new EventEmitter<any>();
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

    openSaveTimeDialog() {
        const ref = this.dialogService.open(CreatePredefinedTimeModal, {
            context: {}, dialogClass: 'model-full'
        })
        ref.onClose.subscribe(name => this.saveTime(name))

    }

    saveTime(name: string) {
        let predefinedTime;
        if (this.relativeTimeChecked) {
            predefinedTime = {
                id: 0,
                name: name,
                startTime: this.relativeDateTime,
                endTime: 'now',
                dateTimeType: 'RELATIVE'
            }
        } else {
            predefinedTime = {
                id: 0,
                name: name,
                startTime: this.absoluteDateTime.startDateTime,
                endTime: this.absoluteDateTime.endDateTime,
                dateTimeType: 'ABSOLUTE'
            }
        }
        this.savePredefinedTime.emit(predefinedTime)
    }
}
