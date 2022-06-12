import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDropDownItem } from '../../../../core/models/general/drop-down-item.model';
import { ConversionHelper } from '../../../../core/helpers/conversion';
import { IEchangeCommercialModel, IEchangeCommercial, ICheckRdvIsExistModel } from '../../agenda-commercial.model';
import { BaseEditTemplateComponent } from '../../../../shared/base-features/base-edit.component';
import { Address } from 'app/core/models/general/address.model';
import { EchangeCommercialPriority } from '../../../../core/enums/echange-commercial-priority.enum';
import { IClient } from '../../../clients/client.model';
import { Contact } from '../../../../core/models/contacts/contact';
import { EchangeCommercialType } from '../../../../core/enums/echange-commercial-type.enum';
import { ModeEnum } from '../../../../core/enums/mode.enum';
import { ToastService } from '../../../../core/layout/services/toast.service';
import { EchangeCommercialStatus } from 'app/core/enums/echange-commercial-status.enum';
import { DateHelper } from '../../../../core/helpers/date';
import { IDossier } from './../../../dossier/dossier.model';
import { ArrayHelper } from 'app/core/helpers/array';
import { AgendaCommercialService } from '../../agenda-commercial.service';
import { DialogHelper } from 'app/core/helpers/dialog';
import { UserHelper } from 'app/core/helpers/user';
import { AgendaType } from 'app/core/enums/agenda-type.enum';

@Component({
    selector: 'kt-agenda-commercial-edit',
    templateUrl: './edit.component.html'
})
export class AgendaCommercialEditComponent extends BaseEditTemplateComponent<IEchangeCommercialModel> implements OnInit {

    /** the title of pop up */
    title: string;

    /** the priorite */
    Priorite: IDropDownItem<number, string>[] = [];

    /** the site intervention */
    address: Address[] = [];

    /** the contact */
    contacts: Contact[] = [];

    /** current selected client */
    selectedClient: IClient;
    selectedDossier = false;

    /** types agenda commercial */
    types = EchangeCommercialType;

    type = AgendaType;

    /** types echange commercial */
    echangeCommercial: IEchangeCommercial;

    constructor(
        public dialogRef: MatDialogRef<AgendaCommercialEditComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        protected echangeCommercialService: AgendaCommercialService,
        private matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            form: FormGroup,
            mode: ModeEnum,
            type: EchangeCommercialType,
            echangeCommercial?: IEchangeCommercial,
            dateEvent?: string,
            clientId?: number,
            dossierId?: number,
        }
    ) {
        super();
    }

    ngOnInit() {
        this.form = this.data.form;
        this.mode = this.data.mode;

        if (this.mode === ModeEnum.Add) {
            this.title = this.getTitle(this.getNameType(this.data.type));
        } else {
            this.title = this.getTitle(this.getNameType(this.data.echangeCommercial.type));
        }

        if (this.data.echangeCommercial != null) {
            const address = this.data.echangeCommercial.addresses ?
                this.data.echangeCommercial.addresses : [];
            this.address = !ArrayHelper.isEmptyOrNull(address) ? address : [];

            const contact = this.data.echangeCommercial.contacts ?
                this.data.echangeCommercial.contacts : [];
            this.contacts = !ArrayHelper.isEmptyOrNull(contact) ? contact : [];


            this.echangeCommercial = this.data.echangeCommercial;
            this.selectedClient = this.data.echangeCommercial?.client;
        }

        if (this.data?.dateEvent) {
            this.form.get('dateEvent').setValue(new Date(this.data.dateEvent));
        }

        this.chargeDropDownTachePriority();
    }

    /**
     * title of pop up
     */
    getTitle(name: string) {
        switch (this.mode) {
            case ModeEnum.Add:
                return `${name}.ADD_TITLE`;

            case ModeEnum.Edit:
                return `${name}.EDIT_TITLE`;

            case ModeEnum.Show:
                return `${name}.SHOW_TITLE`;
        }
    }

    /**
     * name of pop up
     */
    getNameType(type: EchangeCommercialType) {
        switch (type) {
            case EchangeCommercialType.Appel:
                return 'APPELS';

            case EchangeCommercialType.RDV:
                return 'RENDEZ-VOUS';

            case EchangeCommercialType.Tache:
                return 'TACHE';
        }
    }

    /**
     * save changes
     */
    save(values: any) {
        if (this.form.valid) {

            if (values.time != null) {
                values.time = DateHelper.isValidDate(values.time) ? DateHelper.formatTime(values.time) : values.time;
            }

            if (this.data.clientId != null) {
                values.clientId = this.data.clientId;
            }

            if (this.data.dossierId != null) {
                values.dossierId = this.data.dossierId;
            }
            values.agenceId = UserHelper.getAgenceId();

            values.addresses = this.address?.length > 0 ? this.address : null;
            values.contacts = this.contacts?.length > 0 ? this.contacts : null;
            values.categorieId = this.form.controls.categorieId.value ? this.form.controls.categorieId.value : null;
            values.typeAppelId = this.form.controls.typeAppelId.value ? this.form.controls.typeAppelId.value : null;
            values.rdvTypeId = this.form.controls.rdvTypeId.value ? this.form.controls.rdvTypeId.value : null;
            values.tacheTypeId = this.form.controls.tacheTypeId.value ? this.form.controls.tacheTypeId.value : null;
            values.sourceRDVId = this.form.controls.sourceRDVId.value ? this.form.controls.sourceRDVId.value : null;

            values.status = this.mode === ModeEnum.Add ? EchangeCommercialStatus.enCours : this.echangeCommercial?.status;
            values.dateEvent = DateHelper.formatDate(this.form.controls.dateEvent.value);

            this.dialogRef.close(values);
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    saveBase() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            if (this.data.type === EchangeCommercialType.RDV) {
                const checkRdvIsExistModel: ICheckRdvIsExistModel = {
                    dateEvent: DateHelper.formatDate(values.dateEvent),
                    time: values.time != null ? (DateHelper.isValidDate(values.time) ?
                        DateHelper.formatTime(values.time) : null) : values.time,
                    clientId: values.clientId != null ? values.clientId : null,
                    responsableId: values.responsableId != null ? values.responsableId : null,
                }
                this.CheckRdvIsExist(checkRdvIsExistModel, () => {
                    this.save(values);
                });
            } else {
                this.save(values);
            }
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * Check Rdv Is Exist in the same date and hour
     */
    CheckRdvIsExist(checkRdvIsExistModel: ICheckRdvIsExistModel, success: () => void): void {
        this.echangeCommercialService.CheckRdvIsExist(checkRdvIsExistModel).subscribe(result => {
            if (result.value === true) {
                DialogHelper.openConfirmDialog(this.matDialog, {
                    header: this.translate.instant('LABELS.CONFIRMATION'),
                    message: this.translate.instant('CHECK_RDV_IS_EXIST.QUESTION'),
                    cancel: this.translate.instant('LABELS.CANCEL'),
                    confirm: this.translate.instant('LABELS.CONFIRM')
                }, () => {
                    success();
                });
            } else {
                success();
            }
        });
    }

    /** charge dropdown priority */
    chargeDropDownTachePriority() {
        this.Priorite = ConversionHelper.convertEnumToListKeysValues(EchangeCommercialPriority, 'number');
        this.Priorite.forEach(e => e.text = `TACHE_PRIORITY.${e.value}`);
    }

    /**
     * set site d'intervention
     */
    setSiteIntervention(address: Address) {
        if (address != null)
            this.address[0] = address;
    }

    /**
     * set contact
     */
    setContact(contact: Contact) {
        if (contact != null)
            this.contacts[0] = contact;
    }

    /**
     * set client
     * @param client the client object
     */
    setClient(client: IClient) {
        this.selectedClient = client;
        this.selectedDossier = true;
        if (this.geType() === EchangeCommercialType.Appel || this.geType() === EchangeCommercialType.RDV) {
            this.form.get('phoneNumber').setValue(client.phoneNumber);
        }
    }

    /**
     * set dossier
     * @param dossier the dossier object
     */
    setDossier(dossier: IDossier) {
        this.selectedClient = dossier?.client;
        this.selectedDossier = false;
        this.form.get('clientId').setValue(dossier?.clientId);
    }

    /**
     * name of pop up
     */
    geType() {
        switch (this.data.type) {
            case EchangeCommercialType.Appel:
                return EchangeCommercialType.Appel;

            case EchangeCommercialType.RDV:
                return EchangeCommercialType.RDV;

            case EchangeCommercialType.Tache:
                return EchangeCommercialType.Tache;
        }
    }
}
