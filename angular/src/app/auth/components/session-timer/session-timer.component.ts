import {
    Component,
    Inject,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material';
import { AuthService } from '../../shared/services/auth.service';
import { Idle } from '@ng-idle/core';
import { debounceTime } from 'rxjs/operators';
import { PubSubService } from '@shared/services/pub-sub.service';

@Component({
    selector: 'app-session-timer',
    templateUrl: './session-timer.component.html',
    styleUrls: ['./session-timer.component.scss'],
})

export class SessionTimerComponent implements OnInit, OnDestroy {
    public warningInterval: number;
    public timerCurrentVal: string;
    public secondsLeft = 15;

    constructor(
        @Inject('moment') private moment,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private authService: AuthService,
        private idle: Idle,
        private dialogRef: MatDialogRef<SessionTimerComponent>,
        private pubSub: PubSubService,
    ) {
        /**
         * @description - registration icons url for using in html attr
         */
        this.iconRegistry.addSvgIcon(
            'timer',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/timer.svg'));

        this.pubSub.$sub('sessionExpiredClosed', () => {
            this.dialogRef.close();
        });
    }

    ngOnInit() {
        this.timerCurrentVal = this.formatDuration(this.secondsLeft);
        this.warningInterval = window.setInterval(() => this.reduceTimer(), 1000);
    }

    ngOnDestroy() {
        clearInterval(this.warningInterval);
    }

    public continueWorking() {

        this.authService.refreshToken().subscribe(() => {});

        this.dialogRef.close(localStorage.setItem('continueWorkingPressed', 'true'));
        this.dialogRef.afterClosed().pipe(
            debounceTime(500),
        ).subscribe(() => {
            localStorage.removeItem('continueWorkingPressed');
        });
    }

    private _logout(): void {
        this.authService.logout();
        this.dialogRef.close();
    }

    private reduceTimer(): void {
        if (this.secondsLeft > 0) {
            this.secondsLeft--;
            this.timerCurrentVal = this.formatDuration(this.secondsLeft);
        } else {
            clearInterval(this.warningInterval);
            this._logout();
        }
    }

    private formatDuration(duration) {
        return this.moment.duration(duration, 'seconds').format('mm:ss', { trim: false });
    }
}
