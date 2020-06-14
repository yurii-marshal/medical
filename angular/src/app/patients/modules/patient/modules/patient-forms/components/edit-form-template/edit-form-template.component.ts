import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MatIconRegistry } from '@angular/material/icon';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { ToasterService } from '@shared/services/toaster.service';
import { getBase64FromBuffer } from '@shared/helpers/base-64';
import { DictionariesEndpointsService } from '@shared/endpoints/core/dictionaries/dictionaries.endpoints';
import { TemplatesEndpointsService } from '@shared/endpoints/templates/templates.endpoints';
import { PdfTemplate, PdfTemplateField } from '@shared/endpoints/templates/templates.interface';
import { PdfFormInfo } from '@shared/modules/pdf-form-review/models/pdf-form-review.interfaces';
import { PdfFormReviewService } from '@shared/modules/pdf-form-review/services/pdf-form-review.service';
import { PatientService } from '@app/patients/modules/patient/services/patient.service';

@Component({
    templateUrl: './edit-form-template.component.html',
    styleUrls: ['./edit-form-template.component.scss'],
})
export class EditFormTemplateComponent implements OnInit, OnDestroy {

    @ViewChild('fileUploaderInput')
    fileUploaderInput: ElementRef;

    public patientId: string;
    public templateId: string;
    public loading: boolean;
    public form: FormGroup;
    public pdfInfo: PdfFormInfo;
    private currentFieldName: string;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private toasterService: ToasterService,
        private dictionariesEndpoints: DictionariesEndpointsService,
        private templatesEndpoints: TemplatesEndpointsService,
        private pdfFormReviewService: PdfFormReviewService,
        private patientService: PatientService,
    ) {
    }

    get isEdit(): boolean {
        return !!this.templateId;
    }

    ngOnInit(): void {
        this.patientService.hideSidebar(true);
        this.patientId = this.route.snapshot.parent.parent.parent.paramMap.get('patientId');
        this.templateId = this.route.snapshot.paramMap.get('templateId');
        if (this.templateId) {
            this.getPdfTemplate();
        }
        this.initForm();
        this.initSvgIcons();
    }

    ngOnDestroy() {
        this.patientService.hideSidebar(false);
    }

    public goToPatientForms(): void {
        this.router.navigate(['/patient', this.patientId, 'forms']);
    }

    public onFileChange(event: any) {
        const file = event.target.files[0];

        if (['application/pdf'].indexOf(file.type) === -1) {
            this.toasterService.showToaster(
                `Invalid file type. Selected file ${file.name} has invalid type, must be: pdf'`,
                ['danger', 'nikoToast'],
            );
            return false;
        }
        const reader = new FileReader();

        reader.onload = () => this.onFileUpload(reader, file);
        reader.readAsArrayBuffer(file);
    }

    public onAssignFieldOutside(fieldName) {
        if (this.currentFieldName === fieldName) {
            this.currentFieldName = '';
            this.pdfFormReviewService.clearHighlights();
        }
    }

    public onAssignFieldFocus(fieldName: string) {
        if (this.currentFieldName !== fieldName) {
            this.pdfFormReviewService.setHighlightRectangle(fieldName);
            this.currentFieldName = fieldName;
        }
    }

    public onSubmit(): void {
        const value = this.form.getRawValue();
        const data: PdfTemplate = {
            Name: value.name,
            File: this.isEdit ? null : {Name: value.template, Bytes: value.bytes},
            Description: value.description,
            Fields: value.fields.map((field) => ({Field: field.id, Value: field.value})),
        };
        this.loading = true;

        const saveTemplate$ = !this.isEdit ?
            this.templatesEndpoints.createPdfTemplate(data) :
            this.templatesEndpoints.updatePdfTemplate(this.templateId, data);

        saveTemplate$.subscribe(() => {
            this.toasterService.showToaster(
                `Template was successfully ${this.isEdit ? 'updated' : 'created'}.`,
                ['success', 'nikoToast'],
            );
            this.loading = false;
            this.goToPatientForms();
        });
    }

    private onFileUpload(reader: FileReader, file: any): void {
        this.form.get('template').setValue(file.name);
        this.form.get('bytes').setValue(
            getBase64FromBuffer(reader.result),
        );
        this.loading = true;
        this.templatesEndpoints.loadPdfInfo(file).subscribe((pdfInfo) => {
            this.pdfInfo = pdfInfo;
            this.createFormFields();
            this.loading = false;
        });
    }

    private initSvgIcons(): void {
        this.iconRegistry.addSvgIcon(
            'upload',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/upload.svg'),
        );
        this.iconRegistry.addSvgIcon(
            'chevron',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/chevron.svg'),
        );
    }

    private initForm(): void {
        this.form = this.fb.group({
            template: [{value: '', disabled: true}, this.isEdit ? [] : [Validators.required]],
            bytes: ['', this.isEdit ? [] : [Validators.required]],
            name: ['', [Validators.required]],
            description: ['', []],
            fields: this.fb.array([]),
        });
    }

    private getPdfTemplate(): void {
        this.loading = true;

        forkJoin([
            this.templatesEndpoints.getPdfTemplate(this.templateId),
            this.templatesEndpoints.getPdfInfo(this.templateId),
        ]).subscribe(([data, pdfInfo]) => {
            this.form.get('name').setValue(data.Name);
            this.form.get('description').setValue(data.Description);
            this.pdfInfo = pdfInfo;
            this.createFormFields(data.Fields);
            this.loading = false;
        });
    }

    private createFormFields(savedFields?: PdfTemplateField[]): void {
        const formFields = this.form.get('fields') as FormArray;

        for (const pdfField of this.pdfInfo.Fields) {
            const savedField = savedFields && savedFields.find((item) => item.Field === pdfField.FullName);
            const value = savedField ? savedField.Value : '';

            formFields.push(
                this.fb.group({
                    id: [pdfField.FullName, [Validators.required]],
                    name: [pdfField.ToolTip || pdfField.FullName, []],
                    value: [value, []],
                }),
            );
        }
    }

}
