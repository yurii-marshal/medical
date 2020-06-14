import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnDestroy,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolbarRow } from './toolbar.interface';
import { fromEvent } from 'rxjs/observable/fromEvent';

/**
 * 'Toolbar' Component
 * Location:
 * -------------------
 * **ToolbarModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/toolbar</example-url>
 *
 * @example
 * <app-toolbar [toolbarActionsInput]="menuOptions"></app-toolbar>
 */
@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})

export class ToolbarComponent implements OnInit, OnDestroy {
    isMenuOpen = false;
    toolbarActions: ToolbarRow[] = [];
    @ViewChild('toolbarContainer') toolbarContainer: ElementRef;
    /**
     * @description these event emiters can be used from parent element
     *              to handle menuOpened and menuClosed events
     */
    @Output() menuClosed: EventEmitter<void> = new EventEmitter<void>();
    @Output() menuOpened: EventEmitter<void> = new EventEmitter<void>();
    private readonly TOOLBAR_ICONS_NAMESPACE = 'toolbarIcon-';
    private documentClickSub: Subscription;

    constructor(
        private matIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
    }

    /** Input for object with decriptions of toolbars for their generetion  */
    @Input() set toolbarActionsInput(input: ToolbarRow[]) {
        this.toolbarActions = input.map((toolbarRow: ToolbarRow, index: number) => {
            const iconName = `${this.TOOLBAR_ICONS_NAMESPACE}${index}`;
            this.matIconRegistry.addSvgIcon(iconName, this.sanitizer.bypassSecurityTrustResourceUrl(toolbarRow.icon.url));
            toolbarRow.svgIcon = iconName;
            return toolbarRow;
        });
    }

    ngOnInit() {
        this.matIconRegistry.addSvgIcon('plusIcon', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/plus.svg'));
    }

    ngOnDestroy() {
        if (this.documentClickSub) {
            this.documentClickSub.unsubscribe();
        }
    }

    switchMenuStatus(): void {
        this.isMenuOpen = !this.isMenuOpen;

        if (!this.isMenuOpen) {
            this.triggerMenuClose();
            return;
        }

        this.triggerMenuOpen();
    }

    triggerMenuClose(): void {
        if (this.documentClickSub) {
            this.documentClickSub.unsubscribe();
        }
        this.menuClosed.emit();
    }

    triggerMenuOpen(): void {
        this.documentClickSub = fromEvent(document, 'click').subscribe((event: any) => {
            if (!this.toolbarContainer.nativeElement.contains(event.target)) {
                this.isMenuOpen = false;
                this.triggerMenuClose();
            }
        });
        this.menuOpened.emit();
    }
}
