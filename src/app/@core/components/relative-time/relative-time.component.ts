import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounce, debounceTime, delay } from 'rxjs/operators';

@Component({
    selector: 'relative-time',
    templateUrl: 'relative-time.component.html',
    styleUrls: ['relative-time.component.scss'],
})
export class RelativeTimeComponent implements OnInit {
    measurements = [{ name: 'minutes', value: 'm' }, { name: 'hours', value: 'H' },
        { name: 'days', value: 'd' }, { name: 'weeks', value: 'w' }, { name: 'months', value: 'mo' },
        { name: 'years', value: 'y' }]

    @Input() disabled: boolean
    @Output() onChange: EventEmitter<string> = new EventEmitter()
    formGroup = new FormGroup({
        lastNext: new FormControl('Last', Validators.required),
        measurementNumber: new FormControl('12', Validators.required),
        measurement: new FormControl('H', Validators.required),
    });

    ngOnInit(): void {
        this.formGroup.valueChanges.pipe(debounceTime(300)).subscribe(change => {
            const lastNext = this.formGroup.controls['lastNext'].value
            const measurementNumber = this.formGroup.controls['measurementNumber'].value
            const measurement = this.formGroup.controls['measurement'].value

            let result = '';
            if (lastNext === 'Last') {
                let finalMeasurementNumber = measurementNumber;
                if (measurement == 'H') {
                    finalMeasurementNumber *= 60
                } else if (measurement == 'd') {
                    finalMeasurementNumber *= 24 * 60
                } else if (measurement == 'w') {
                    finalMeasurementNumber *= 24 * 60 * 7
                } else if (measurement == 'mo') {
                    finalMeasurementNumber *= 24 * 60 * 7 * 30
                } else if (measurement == 'y') {
                    finalMeasurementNumber *= 24 * 60 * 7 * 30 * 12
                }
                result = `now-${finalMeasurementNumber}m`
            }
            this.onChange.emit(result)
        })
    }

    lastNextChange(lastNext) {
        this.formGroup.controls['lastNext'].setValue(lastNext)
    }
}
