import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogOptions } from '../models/general/alert-options';
import { ConfigDialogComponent } from 'app/shared/ui-material-elements/config-dialog/config-dialog.component';
import { Observable } from 'rxjs';

interface ConfirmDialogMessages {
    header: string;
    message: string;
    cancel: string;
    confirm: string;
}

export class DialogHelper {

    /**
     * small size of dialog
     */
    static SIZE_SMALL = '350px';

    /**
     * medium size of dialog
     */
    static SIZE_MEDIUM = '720px';

    /**
     * large size
     */
    static SIZE_LARGE = '960px';

    /**
     * open alert dialog
     * @param dialog Service to open Material Design modal dialogs.
     * @param options the alert dialog options
     * @param dialogComponent the dialog that you want to open
     */
    static openAlertDialog(dialog: MatDialog, options: DialogOptions, dialogComponent: any): MatDialogRef<any> {
        return dialog.open(dialogComponent, {
            hasBackdrop: true,
            disableClose: true,
            data: options,
            width: DialogHelper.SIZE_SMALL
        });
    }

    /**
     * open confirm dialog
     * @param dialog the dialog service
     * @param translatedMessages the messages translated
     * @param callbackSuccess the callback click confirm
     */
    static openConfirmDialog(dialog: MatDialog, translatedMessages: ConfirmDialogMessages, callbackSuccess) {
        const options: DialogOptions = {
            header: translatedMessages.header,
            message: translatedMessages.message,
            buttons: [
                {
                    text: translatedMessages.cancel,
                    handler: () => { },
                    cssClass: 'warn',
                },
                {
                    text: translatedMessages.confirm,
                    cssClass: 'primary',
                    handler: () => {
                        callbackSuccess();
                    }
                }
            ],
        };
        DialogHelper.openAlertDialog(dialog, options, ConfigDialogComponent);
    }

    /**
     * open dialog
     */
    static openDialog(dialog: MatDialog, dialogComponent: any, width: string, data: any): Observable<any> {
        const dialogRef = dialog.open(dialogComponent, { width, data });
        return dialogRef.afterClosed();
    }

}
