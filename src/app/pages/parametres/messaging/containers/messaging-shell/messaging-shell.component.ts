import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ResultStatus } from 'app/core/enums/result-status';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IMessaging, IMessagingModel } from '../../messaging.model';
import { MessagingService } from '../../messaging.service';

@Component({
    selector: 'kt-messaging-shell',
    templateUrl: './messaging-shell.component.html'
})
export class MessagingShellComponent implements OnInit {

    messaging: IMessaging;

    constructor(
        private messagingService: MessagingService,
        private translate: TranslateService,
        private translationService: TranslationService,
        private toastService: ToastService
    ) { }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
        this.getMessaging();
    }

    //#region services

    /**
     * get current messaging configuration
     */
    getMessaging() {
        this.messagingService.Get().subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.messaging = result.value;
            }
        });
    }

    /**
     * update messaging configuration
     */
    updateMessaging(model: IMessagingModel, modeId: string) {
        this.messagingService.Update(modeId, model).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                this.toastService.success(this.translate.instant('SUCCESS.EDIT'));
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * add messaging configuration
     */
    addMessaging(model: IMessagingModel) {
        this.messagingService.Add(model).subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                this.toastService.success(this.translate.instant('SUCCESS.ADD'));
                this.messaging = res.value;
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    //#endregion

    //#region save event

    /**
     * save event
     */
    saveEvent(messagingModel: IMessagingModel) {
        if (this.messaging) {
            this.updateMessaging(messagingModel, this.messaging.id);
        } else {
            this.addMessaging(messagingModel);
        }
    }

    //#endregion
}
