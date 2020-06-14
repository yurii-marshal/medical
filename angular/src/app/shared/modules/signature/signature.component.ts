import {
    AfterViewInit,
    Component,
    ElementRef,
    forwardRef,
    NgZone,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import SignaturePad, { IPointGroup } from 'signature_pad';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CanvasResizeService } from './services/canvas-resize.service';

/**
 * 'Signature' Component
 * Location:
 * -------------------
 * **SignatureModule**
 *
 * <example-url>http://niko.loc:8082/v2#/demo-components/signature</example-url>
 */

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SignatureComponent),
        multi: true,
    },
  ],
})
export class SignatureComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

    @ViewChild('canvas') private canvas: ElementRef;
    @ViewChild('canvasContainer') private canvasContainer: ElementRef;
    public signaturePad: SignaturePad;
    public setSigned = false;
    public sendBase64 = false;
    private windowResizeSub: Subscription;

    constructor(
        private zone: NgZone,
        private canvasResizeService: CanvasResizeService,
    ) {
        this.zone.runOutsideAngular(() => {
            this.windowResizeSub = fromEvent(window, 'resize').subscribe(() => {
                if (!this.signaturePad.isEmpty()) {
                    this.resizeCanvas();
                    this.renderViewValue(this.signaturePad.toData());
                }
            });
        });
    }

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            this.signaturePad = new SignaturePad(this.canvas.nativeElement);
        });
        this.resizeCanvas();
    }

    public apply(): void {
        if (!this.signaturePad.isEmpty()) {
            const padDataToBase64 = window.atob(this.signaturePad.toDataURL().split(',')[1]);
            const padDataToBase64Length = padDataToBase64.length;
            const bytes = [];

            for (let i = 0; i < padDataToBase64Length; i++) {
                bytes.push(padDataToBase64.charCodeAt(i));
            }

            if (this.sendBase64) {
                this.writeValue(this.signaturePad);
            } else {
                this.writeValue(bytes);
            }

            this.setSigned = true;
            this.signaturePad.off();
        }
    }

    public reset(): void {
        this.writeValue(null);
        this.setSigned = false;

        this.zone.runOutsideAngular(() => {
            this.signaturePad.on();
        });
    }

    public clear(): void {
        this.signaturePad.clear();
    }

    private renderViewValue(signatureData: IPointGroup[]): void {
        if (signatureData && signatureData.constructor === [].constructor) {
            this.signaturePad.fromData([...signatureData]);
        } else {
            this.signaturePad.clear();
        }
    }

    private resizeCanvas(): void {
        this.canvasResizeService.resize(this.canvas, this.canvasContainer, this.signaturePad.toData());
    }

    ngOnDestroy() {
        if (this.windowResizeSub) {
            this.windowResizeSub.unsubscribe();
        }
    }

    onChange: any = () => {};
    onTouched: any = () => {};

    writeValue(signature: any): void {
        this.onChange(signature);
    }

    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}
