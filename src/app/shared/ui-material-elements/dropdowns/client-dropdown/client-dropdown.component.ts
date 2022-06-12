import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ClientType } from 'app/core/enums/client-type.enum';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { RouteName } from 'app/core/enums/route-name.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IClient, IClientModel } from 'app/pages/clients/client.model';
import { ClientsService } from 'app/pages/clients/clients.service';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { AddClientComponent } from './add-client/add-client.component';
import { DialogSelectClientComponent } from './dialog-select-client/dialog-select-client.component';

@Component({
    selector: 'kt-client-dropdown',
    styleUrls: ['./client-dropdown.component.scss'],
    template: `
        <mat-form-field appearance="fill" class="example-full-width" [formGroup]="formInstant">
            <mat-label>{{ label }}</mat-label>

            <input
                matInput
                disabled
                type="string"
                [value]="selectedClient?.fullName"
                placeholder="{{ placeholder }}" />
            <input type="hidden" [id]="'inputName'" [formControlName]="inputName" />

            <span matSuffix>
                <span
                    *ngIf="!isShow"
                    class="material-icons pointer-cursor"
                    (click)="selectClientDialog()"
                    [matTooltip]="'LABELS.LIST' | translate" >
                    list
                </span>
                <span
                    *ngIf="showAdd"
                    class="material-icons pointer-cursor"
                    (click)="addClientDialog($event)"
                    [matTooltip]="'LABELS.ADD' | translate">
                    add
                </span>
                <span
                    *ngIf="isShow"
                    class="material-icons pointer-cursor"
                    (click)="goToClient()"
                    [matTooltip]="'LABELS.SHOW' | translate">
                    visibility
                </span>
            </span>

            <mat-hint class="text-danger">
                <kt-custom-error-display [control]="control"></kt-custom-error-display>
            </mat-hint>

        </mat-form-field>
    `
})
export class ClientDropdownComponent extends BaseCustomUiComponent {

    @Input()
    types: ClientType[] = [];

    @Input()
    isShow = false;

    @Input()
    showAdd = false;

    @Input()
    set client(value: IClient) {
        this.selectedClient = value;
    }

    selectedClient: IClient;

    constructor(
        private dialog: MatDialog,
        private clientService: ClientsService,
        private toastService: ToastService,
        private translate: TranslateService,
        private router: Router
    ) {
        super();
    }

    selectClientDialog(): void {
        const data = { types: this.types }
        DialogHelper
            .openDialog(this.dialog, DialogSelectClientComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe((result) => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.selectedClient = result as IClient;
                    this.changeSelect();
                    this.setValueInForm();
                }
            });
    }

    addClientDialog(event: any): void {
        event.stopPropagation();
        DialogHelper.openDialog(this.dialog, AddClientComponent, DialogHelper.SIZE_MEDIUM, null)
            .subscribe((resultDialog) => {
                if (!StringHelper.isEmptyOrNull(resultDialog)) {
                    this.addClientService(resultDialog);
                }
            });
    }

    /**
     * check reference is unique
     * @param callback the callback
     */
    checkReferenceIsUnique(clientModel: IClientModel, callback) {
        this.clientService.IsUniqueReference(clientModel.reference).subscribe((result) => {
            if (result.status === ResultStatus.Succeed &&
                !result.value) {
                this.toastService.error(this.translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'));
                callback(false);
                return;
            }
            callback(true);
        });
    }

    /**
     * Add client action
     */
    addClientService(clientModel: IClientModel) {
        this.checkReferenceIsUnique(clientModel, (checkResult: boolean) => {
            if (checkResult) {
                this.clientService.Add(clientModel).subscribe(result => {
                    if (result.hasValue) {
                        this.toastService.success(this.translate.instant('SUCCESS.ADD'));
                        this.selectedClient = result.value;
                        this.setValueInForm();
                        this.changeSelect()
                    } else {
                        this.toastService.error(this.translate.instant('ERRORS.SERVER'));
                    }
                });
            }
        });
    }

    private setValueInForm() {
        this.formInstant.get(this.inputName).setValue(this.selectedClient.id);
    }

    private changeSelect() {
        this.changeEvent.emit(this.selectedClient);
    }

    goToClient() {
        if (this.selectedClient) {
            const navigationExtras = {
                queryParams: {
                    id: this.selectedClient.id,
                    mode: ModeEnum.Show
                }
            };
            this.router.navigate([`/${RouteName.Clients}`], navigationExtras);
        }
    }

}
