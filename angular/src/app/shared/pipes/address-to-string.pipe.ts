import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'addressToString'})
export class AddressToStringPipe implements PipeTransform {
    transform(address): string {

        if (!address) {
            return '';
        }

        const City = address.City ? address.City : '';
        let State = address.State ? address.State : '';
        let Zip = address.Zip ? address.Zip : '';

        if (typeof Zip === 'object') {
            Zip = Zip.Text ? Zip.Text :
                Zip.text ? Zip.text :
                    '';
        }

        // State only 2 char
        if (typeof State === 'object') {
            State = State.description && State.description.length <= 2 ? State.description :
                State.Text && State.Text.length <= 2 ? State.Text :
                    State.id && State.id.length <= 2 ? State.id :
                        State.Id && State.Id.length <= 2 ? State.Id :
                            '';
        }

        return [
            address.AddressLine,
            address.AddressLine1,
            address.AddressLine2,
            City,
            State,
            Zip,
        ].filter((str) => {
            return !!str;
        }).join(', ');

    }
}
