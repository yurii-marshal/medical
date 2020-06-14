import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
    selector: 'app-form-input',
    styleUrls: ['./form-chips.component.scss'],
    template: `
        <div class="dynamic-field form-input">
            <label class="dynamic-label">{{ config.label }}:</label>
            <div class="chips">
                <mat-form-field class="chips-add-input">
                    <input
                        matInput
                        placeholder="Input Label:"
                        [attr.aria-label]="'+' + config.placeholder"
                        [(ngModel)]="inputString"
                        (keydown)="keyDownFunction($event)">
                    <mat-icon matSuffix (click)="addChip()">add_circle</mat-icon>
                </mat-form-field>

                <mat-chip-list>
                    <mat-chip *ngFor="let chip of chips; let j = index">{{ chip }}
                        <mat-icon matChipRemove (click)="removeChip(j)">close</mat-icon>
                    </mat-chip>
                </mat-chip-list>
            </div>
        </div>
    `,
})

export class FormChipsComponent implements Field, OnInit {
    public config: FieldConfig;
    public group: FormGroup;
    public chips: string[];
    public inputString = '';

    ngOnInit() {
        this.chips = this.config.chips ? this.config.chips : [];
    }

    public keyDownFunction(event: any) {
        if (event.keyCode === 13) {
            this.addChip();
        }
    }

    public addChip() {
        this.chips.push(this.inputString);
        this.inputString = '';
        this.updateControl();
    }

    public removeChip(j: number) {
        this.chips.splice(j, 1);
        this.updateControl();
    }

    public updateControl() {
        this.group.get(this.config.name).patchValue(this.chips);
    }

}
