import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResultStatus } from 'app/core/enums/result-status';
import { ClientRelationType } from 'app/core/enums/type-relation-client.enum';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IClientRelation } from 'app/core/models/general/client-relation.model';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { IClient } from 'app/pages/clients/client.model';
import { ClientsService } from 'app/pages/clients/clients.service';

@Component({
    selector: 'kt-add-relation-client',
    templateUrl: './add-relation-client.component.html'
})
export class AddRelationClientComponent implements OnInit {

    /** form group of relation client attributes */
    form: FormGroup;

    /** the title of modal */
    title: string;

    /** type relation client status */
    typeRelationClient: IDropDownItem<number, string>[] = [];

    /** current selected client */
    selectedClient: IClient;

    constructor(
        public dialogRef: MatDialogRef<AddRelationClientComponent>,
        private fb: FormBuilder,
        private toastService: ToastService,
        private translate: TranslateService,
        private clientsService: ClientsService,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string,
            clientRelation?: IClientRelation
        }
    ) {
        this.form = this.fb.group({
            clientId: [null, [Validators.required]],
            type: [null, [Validators.required]],
        });
        this.chargetypeRelationClient();
    }

    ngOnInit(): void {
        this.initialization();
    }

    initialization() {
        this.title = this.data.title;
        if (this.data.clientRelation != null) {
            this.setDataInForm(this.data.clientRelation);
        }
        this.getClientById(this.data.clientRelation?.clientId);
    }

    setDataInForm(client: IClientRelation) {
        this.form.setValue({
            clientId: client.clientId,
            type: client.type
        });
    }

    /** save client Relation */
    save() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            values.client = this.selectedClient;
            this.dialogRef.close(values);
        } else {
            this.form.markAllAsTouched();
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    //#region helpers

    /**
     * charge type Relation Client
     */
    chargetypeRelationClient() {
        this.typeRelationClient = ConversionHelper.convertEnumToListKeysValues(ClientRelationType, 'number');
        this.typeRelationClient.forEach(e => e.text = `CLIENT_RELATION_TYPE.${e.value}`);
    }

    /**
     * get client by id
     * @param id the id of entity client
     */
    getClientById(id: string) {
        if (id)
            this.clientsService.Get(id).subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.selectedClient = result.value;
                } else {
                    this.toastService.error(this.translate.instant('ERRORS.SERVER'));
                }
            });
    }

    /**
     * set client
     * @param client the client object
     */
    setClient(client: IClient) {
        this.selectedClient = client;
    }

    //#endregion
}
