import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ShowdownConverter } from 'ngx-showdown';

@Pipe({name: 'markdownToHtml'})
export class MarkdownToHtmlPipe implements PipeTransform {
    constructor(
        private sanitizer: DomSanitizer,
        private showdownConverter: ShowdownConverter,
    ) {
    }

    transform(text: string): SafeHtml {

        if (!text) {
            return;
        }

        // TODO to find out if we need sanitizer
        // return this.sanitizer.bypassSecurityTrustHtml(converter.makeHtml(text));

        return this.showdownConverter.makeHtml(text); // converter.makeHtml(text);
    }
}
