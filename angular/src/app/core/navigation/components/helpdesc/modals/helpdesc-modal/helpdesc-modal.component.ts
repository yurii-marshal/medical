import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersEndpointsService } from '@shared/endpoints/core/users/users.endpoints';

@Component({
    selector: 'app-helpdesc-modal',
    templateUrl: './helpdesc-modal.component.html',
    styleUrls: ['./helpdesc-modal.component.scss'],
})

export class HelpdescModalComponent {

    public helpdescForm: FormGroup;

    public files: any[] = [];

    public isSendingRequest = false;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<HelpdescModalComponent>,
        private usersEndpointsService: UsersEndpointsService,
    ) {
        /**
         * @description - registration icons url for using in html attr
         */
        this.iconRegistry.addSvgIcon(
            'question-fill',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/question-fill.svg'));

        this.iconRegistry.addSvgIcon(
            'upload',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/upload.svg'));

        this.iconRegistry.addSvgIcon(
            'send',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/send.svg'));

        this.iconRegistry.addSvgIcon(
            'trash',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/trash.svg'));
        /**
         * @description - form validations rules
         * @type {FormGroup}
         */
        this.helpdescForm = fb.group(
            {
                subject: ['', [Validators.required]],
                description: ['', [Validators.required]],
                agree: [false, [Validators.required]],
            },
        );
    }

    fileChange(event) {
        for (const file of event.target.files) {
            this.files.push(file);
        }
    }

    removeFile(index) {
        this.files.splice(index, 1);
    }

    public send(): void {

        this.isSendingRequest = true;

        this.usersEndpointsService.sendToHelpdesc({
            files: this.files,
            subject: this.helpdescForm.value.subject,
            description: this.helpdescForm.value.description,
        }).subscribe((data) => {
            this.isSendingRequest = false;
            this.dialogRef.close({
                sent: true,
            });
        });
    }

    public cancel(): void {
        this.dialogRef.close();
    }
}
