import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IMailHistoryModel, IMailModel } from 'app/core/models/general/mail.model';
import { SendEmailComponent } from './send-email/send-email.component';
import { JsonHelper } from 'app/core/helpers/json';
import { DocumentParamterType } from 'app/core/enums/document-parameter-type.enum';
import { StringHelper } from 'app/core/helpers/string';
import { IContactModel } from 'app/core/models/contacts/contact';

@Component({
    selector: 'kt-emails',
    templateUrl: './emails.component.html'
})
export class EmailsComponent {

    /** add email event */
    @Output() addEmailEvent = new EventEmitter<IMailModel>();

    @Input() set Emails(value: string) {
        if (!StringHelper.isEmptyOrNull(value) && JsonHelper.IsJsonString(value)) {
            this.emails = JSON.parse(value);
        }
    }

    @Input() set contacts(value: string) {
        if (!StringHelper.isEmptyOrNull(value) && JsonHelper.IsJsonString(value)) {
            const contacts = JSON.parse(value) as IContactModel[];
            this.emailsTo = contacts.filter(e => StringHelper.isEmptyOrNull(e.email)).map(e => e.email);
        }
    }

    /** the type of document */
    @Input() type: DocumentParamterType;

    /** can revive email */
    @Input() canRevive = true;

    /** the title */
    title = 'EMAILS.TITLE';

    /** list of emails */
    emails: IMailHistoryModel[] = [];

    /** readOnly mode */
    readonly = false;

    /** emails of contacts client */
    emailsTo: string[] = [];

    constructor(
        private translate: TranslateService,
        private dialog: MatDialog
    ) { }

    /**
     * send email
     */
    sendEmail() {
        const title = this.translate.instant(this.getTitle());
        const data = { title, emailsTo: this.emailsTo, type: this.type };
        DialogHelper.openDialog(this.dialog, SendEmailComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe((result: IMailModel) => {
                if (result != null && result !== undefined && result.emailTo != null) {
                    this.addEmailEvent.emit(result);
                }
            });
    }

    /**
     * get title
     */
    getTitle() {
        return this.canRevive && this.emails.length > 0 ? 'EMAILS.REVIVE' : 'EMAILS.SEND';
    }
}
