import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    DemoAdvancedFiltersDialogComponent,
} from '@app/demo/demo-components/advanced-filters/advanced-filters-dialog/advanced-filters-dialog.component';

@Component({
  selector: 'app-demo-advanced-filters',
  templateUrl: './advanced-filters.component.html',
})
export class DemoAdvancedFiltersComponent {

    constructor(private dialog: MatDialog) {
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(DemoAdvancedFiltersDialogComponent, {
            width: '900px',
            data: { name: 'hello' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            console.log(result);
        });
    }

}
