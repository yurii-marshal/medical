import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NlpEndpointsService } from '@shared/endpoints/nlp/nlp.endpoints';
import { UsersStoreService } from '@shared/stores/users-store.service';
import { NikoBotActionRequest } from '@shared/endpoints/nlp/nlp.interface';
import { RouterNavigatorService } from '@shared/services/navigation-router.service';

import { PhonePipe } from '@shared/pipes/phone.pipe';

@Injectable()
export class NikoBotService {

    constructor(
        private router: Router,
        private routerNavigatorService: RouterNavigatorService,
        private nlpEndpointsService: NlpEndpointsService,
        private mentionedUsersService: UsersStoreService,
        private phonePipe: PhonePipe,
    ) {}

    sendAction(actionModel: NikoBotActionRequest): Observable<object> {
        return this.nlpEndpointsService.submitNikoBotAction(actionModel);
    }

    goToPatientDetails(patientId: string): void {
        this.routerNavigatorService.navigate(['/patients', { patientId }]);
    }

    goToRef(titleLink: string): any {
        const splittedLink = {
            linkType: titleLink.split(':')[0],
            linkId: titleLink.split(':')[1],
        };

        if (splittedLink.linkType === 'patient') {
            return () => this.goToPatientDetails(splittedLink.linkId);
        }
    }

    transformPhoneStr(str): string {
        const regPattern = /[0-9 ,;]+(?!\*\*Contacts\:\*\*\s)$/g;
        let telNumbers;
        let telNumbersFormatted;

        if (str.match(regPattern)) {
            telNumbers = str.match(regPattern)[0];

            const telArr = telNumbers.split(',');

            for (let i = 0; i < telArr.length; i++) {
                if (telArr[i].indexOf(';') !== -1) {
                    const extentedTel = telArr[i].split(';');

                    extentedTel[0] = this.phonePipe.transform(extentedTel[0].trim());
                    extentedTel[1] = `Ext.${extentedTel[1]}`;

                    telArr[i] = `${extentedTel[0]}, ${extentedTel[1]}`;

                } else {
                    telArr[i] = this.phonePipe.transform(telArr[i].trim());
                }
            }

            telNumbersFormatted = telArr.join(', ');

            return str.replace(telNumbers, telNumbersFormatted);
        }

        return str;
    }

    convertIdStrToName(str): string {
        if (!str) { return; }

        const patientRe = /#[A-Z, a-z]+\s[A-Z, a-z]+\<patient\:\d+\>/g;
        const userRe = /@\d+/g;

        const patientCodeMatch = str.match(patientRe);
        const userCodeMatch = str.match(userRe);

        if (patientCodeMatch && patientCodeMatch.length) {
            patientCodeMatch.forEach((i) => {
                const item = i.trim();
                const indexOfPatientCodeStart = item.indexOf('<');
                const substrWithName = item.substring(0, indexOfPatientCodeStart).split(' ').join('');

                str = str.replace(item, substrWithName.replace('#', '&#35;'));
            });
        }

        if (userCodeMatch && userCodeMatch.length) {
            userCodeMatch.forEach((i) => {
                const item = i.trim();
                const nameMentioned = this.mentionedUsersService.getMentionedUsers()
                    .find((u) => u.strForBack === item);

                if (nameMentioned) {
                    str = str.replace(item, nameMentioned.id);
                }
            });
        }

        return str;

    }
}
