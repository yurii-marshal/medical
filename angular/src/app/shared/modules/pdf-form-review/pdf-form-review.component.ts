import {
    AfterViewInit,
    ElementRef,
    Component,
    Input,
    OnInit,
    QueryList,
    ViewChildren,
    OnDestroy,
} from '@angular/core';
import { PdfFormDefaultOptions } from './models/options';
import {
    PdfFormConfig,
    PdfFormField,
    PdfFormPage,
} from './models/pdf-form-review.interfaces';
import { PdfFormReviewService } from './services/pdf-form-review.service';

/**
 * 'Pdf Form Review' Component
 * This component allow to review pdf page (in the next phase: hint active fields
 * whether page consists forms (fields, tables, checkboxes ets))
 *
 * Location:
 * -------------------
 * **PdfFormReviewModule**
 * <example-url>http://niko.loc:8082/v2/#/demo-components/pdf-form-review</example-url>
 *
 * Canvas configurations:
 *      canvasConfig.color: string - canvas lines color
 *      canvasConfig.lineWidth: number - canvas lines width
 *      canvasConfig.allowMultiple: boolean - don't remove previous figure
 *
 * Pdf Form Review Service:
 *      setHighlightRectangle({pageId: number, fieldId: number}) - draw rectangle highlight
 *      clearHighlights() - clear all draws
 *
 * @example
 * <app-pdf-form-review
 *      [pages]="pdfPages"
 *      [config]="canvasConfig"
 * >
 * </app-pdf-form-review>
 *
 */
@Component({
    selector: 'app-pdf-form-review',
    templateUrl: './pdf-form-review.component.html',
    styleUrls: ['./pdf-form-review.scss'],
})

export class PdfFormReviewComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Get all active fields related to the image */
    @Input() pages: PdfFormPage[];
    /** Set configurations for a canvas */
    @Input() config: PdfFormConfig;

    @ViewChildren('canvasPdf') canvasPdf: QueryList<ElementRef>;
    @ViewChildren('canvasDraws') canvasDraws: QueryList<ElementRef>;

    private canvasContextImages: CanvasRenderingContext2D[] = [];
    private canvasContextHighlights: CanvasRenderingContext2D[] = [];

    private images: any[] = [];

    private _defaultOptions: PdfFormConfig = PdfFormDefaultOptions();

    constructor(
        private pdfFormReviewService: PdfFormReviewService,
    ) {
    }

    ngOnInit() {
        this.config = this.config ?
            Object.assign(this._defaultOptions, this.config) :
            this._defaultOptions;
    }

    ngAfterViewInit() {
        this.canvasPdf.forEach((canvas, i) => {
            this.canvasContextImages[i] = canvas.nativeElement.getContext('2d');

            this.images[i] = new Image();
            this.images[i].src = `data:image/jpg;base64, ${this.pages[i].Image}`;

            this.images[i].onload = () => {
                this.canvasContextImages[i].drawImage(this.images[i], 0, 0);
            };
        });

        this.initHighlightPages();
    }

    ngOnDestroy() {
        this.pdfFormReviewService.pageSource$.next(null);
        this.pdfFormReviewService.clearSource$.next(false);
    }

    private initHighlightPages() {
        this.pdfFormReviewService.pageSource$.subscribe((fieldName: string) => {
            if (fieldName) {
                if (!this.config.allowMultiple) {
                    this.clearContextHighlights();
                }
                this.setContextHighlights(fieldName);
            }
        });

        this.pdfFormReviewService.clearSource$.subscribe((result: boolean) => {
            if (result) {
                this.clearContextHighlights();
            }
        });

        this.canvasDraws.forEach((canvas, i) => {
            this.canvasContextHighlights[i] = canvas.nativeElement.getContext('2d');

            canvas.nativeElement.style.top = this.canvasContextImages[i].canvas.offsetTop + 'px';

            this.canvasContextHighlights[i].canvas.width = this.pages[i].Size.Width;
            this.canvasContextHighlights[i].canvas.height = this.pages[i].Size.Height;
        });
    }

    private getPageAndFieldIndexes(fieldName: string): [number[], PdfFormField[]] {
        const pagesIds = [];

        const fields = this.pages
            .map((page) => {
                return page.Fields.filter((f) => {
                    if (f.FullName === fieldName) {
                        pagesIds.push(page.Index - 1);
                        return true;
                    } else {
                        return false;
                    }
                });
            })
            .reduce((last, now) => last.concat(now));

        return [pagesIds, fields];
    }

    private setContextHighlights(fieldName: string) {
        const [pagesIds, fields] = this.getPageAndFieldIndexes(fieldName);

        fields.forEach((field, i) => {
            this.canvasContextHighlights[pagesIds[i]].beginPath();
            this.canvasContextHighlights[pagesIds[i]].lineWidth = this.config.lineWidth;
            this.canvasContextHighlights[pagesIds[i]].strokeStyle = this.config.color;
            this.canvasContextHighlights[pagesIds[i]].rect(
                this.pages[pagesIds[i]].Fields[field.IndexOnPage - 1].Rect.X,
                this.pages[pagesIds[i]].Fields[field.IndexOnPage - 1].Rect.Y,
                this.pages[pagesIds[i]].Fields[field.IndexOnPage - 1].Rect.Width,
                this.pages[pagesIds[i]].Fields[field.IndexOnPage - 1].Rect.Height,
            );
            this.canvasContextHighlights[pagesIds[i]].stroke();
            this.canvasContextHighlights[pagesIds[i]].closePath();
        });
    }

    private clearContextHighlights() {
        this.canvasDraws.forEach((canvas, index) => {
            this.canvasContextHighlights[index].clearRect(
                0,
                0,
                canvas.nativeElement.width,
                canvas.nativeElement.height,
            );
        });
    }

}
