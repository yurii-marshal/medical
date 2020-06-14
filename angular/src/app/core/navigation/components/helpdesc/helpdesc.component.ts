import { Component } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MatIconRegistry,
} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HelpdescModalComponent } from '@app/core/navigation/components/helpdesc/modals/helpdesc-modal/helpdesc-modal.component';
import { ToasterService } from '@shared/services/toaster.service';

@Component({
    selector: 'app-helpdesc',
    templateUrl: './helpdesc.component.html',
    styleUrls: ['./helpdesc.component.scss'],
})

export class HelpdescComponent {

    private helpdescDialogRef: MatDialogRef<HelpdescModalComponent>;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private dialog: MatDialog,
        private toasterService: ToasterService,
    ) {
        iconRegistry.addSvgIcon(
            'question-fill',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/question-fill.svg'));
    }

    showHelpdescModal() {
        this.helpdescDialogRef = this.dialog.open(HelpdescModalComponent, {
            panelClass: ['modal-window'],
            disableClose: true,
        });

        this.helpdescDialogRef.afterClosed().subscribe((result) => {
            if (result && result.sent) {
                this.toasterService.showToaster(
                    'Your message was sent successfully!',
                    ['success', 'nikoToast'],
                );
            }
        });
    }
}
