import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'getCssClass'})
export class GetCssClassPipe implements PipeTransform {
    transform(id: number, type: string): string {

        if (!type) {
            return '';
        }

        switch (type) {
            case 'status':
                switch (id) {
                    case 1:
                        return 'active';
                    case 2:
                        return 'inactive';
                    case 3:
                        return 'hold';
                }
                break;
            case 'appointment':
                switch (id) {
                    case 1:
                        return 'initial';
                    case 2:
                        return 'follow-up';
                    case 3:
                        return 'pickup';
                }
                break;
            default:
                return '';
        }
    }
}
