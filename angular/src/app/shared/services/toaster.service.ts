import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ToasterService {

    constructor(
        private toastrService: ToastrService,
    ) {
    }

    public showToaster(msg: string, customClass: string | string[], positionClass = 'toast-top-right') {
        // `toastClass` accepts only string value
        const cstmClass = Array.isArray(customClass) ? customClass.join(' ') : customClass;

        this.toastrService.show(msg, null, {
            toastClass: cstmClass,
            timeOut: 3500,
            easeTime: 0,
            onActivateTick: true,
            positionClass,
            enableHtml: true,
        });
    }
}
