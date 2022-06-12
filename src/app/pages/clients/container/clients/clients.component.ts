import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { ClientType } from 'app/core/enums/client-type.enum';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { SortDirection } from 'app/core/enums/sort-direction';
import { DateHelper } from 'app/core/helpers/date';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IClientFilterOption, IDashboardFilterOption, IFilterOption, ISmsFilterOption } from 'app/core/models/general/filter-option.model';
import { Memo } from 'app/core/models/general/memo.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IChartData } from 'app/pages/dashboard/dashboard.model';
import { DashboardService } from 'app/pages/dashboard/dashboard.service';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { IEnvoyerSmsModel } from 'app/shared/sms/sms.model';
import { SmsService } from 'app/shared/sms/sms.service';
import { ClientShared } from '../../client-shared';
import { IClient, IClientModel } from '../../client.model';
import { ClientsService } from '../../clients.service';

@Component({
    selector: 'kt-clients',
    templateUrl: './clients.component.html'
})
export class ClientsComponent extends BaseContainerTemplateComponent implements OnInit {

    /** client list */
    clients: IPagedResult<IClient>;

    /** the current client to modify */
    client: IClient;

    /** the filter of folder */
    filterOption: IFilterOption = {
        OrderBy: 'createOn',
        SortDirection: SortDirection.Desc,
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    dashboardFilterOption: IDashboardFilterOption = {
        ...this.filterOption,
        dateTo: DateHelper.formatDateTime(DateHelper.getLastDayInTheCurrentYear()),
        dateFrom: DateHelper.formatDateTime(DateHelper.getFirstDayInTheCurrentYear()),
    };

    /** the form of client */
    form: FormGroup;

    /** the form of client login */
    formLogin: FormGroup;

    /** selected tabs */
    selectedTabs = ClientType.Particulier;

    /** client type */
    clientType = ClientType;

    /** the number of folder for client */
    numberOfFolder: number;

    /** chiffre d'affaire client */
    chiffreAffaireStatistics: IChartData;

    smsFilterOption: ISmsFilterOption = {
        ...this.filterOption
    };

    constructor(
        protected translate: TranslateService,
        protected toastService: ToastService,
        protected router: Router,
        protected route: ActivatedRoute,
        private translationService: TranslationService,
        private clientsService: ClientsService,
        private smsService: SmsService,
        private fb: FormBuilder,
        private dashboardService: DashboardService
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Avoir);
        this.subscribeRouteChanges();
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    //#region routes

    /**
     * subscribe route
     */
    subscribeRouteChanges() {
        this.route.queryParams.subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result?.mode)) {
                const mode = parseInt(result.mode, 10) as ModeEnum;
                switch (mode) {
                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Add:
                        this.addEvent();
                        break;

                    case ModeEnum.Edit:
                        this.editEvent(result.id);
                        break;

                    case ModeEnum.Show:
                        this.showEvent(result.id);
                        break;
                }
            }
        });
    }

    //#endregion

    //#region form

    /**
     * init client form
     */
    initForm() {
        this.form = ClientShared.createForm(this.fb);
    }

    /**
     * initialization login form
     */

    initLoginForm() {
        this.formLogin = this.fb.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]],
            isActive: [false, [Validators.required]]
        });
    }

    /**
     * check reference is unique
     * @param callback the callback
     */
    checkReferenceIsUnique(clientModel: IClientModel, isAdd: boolean, callback) {
        this.subs.sink = this.clientsService.IsUniqueReference(clientModel.reference).subscribe((result) => {
            if (result.status === ResultStatus.Succeed &&
                !result.value &&
                (isAdd ? true : this.client.reference !== clientModel.reference)) {
                this.toastService.error(this.translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'));
                callback(false);
                return;
            }
            callback(true);
        });
    }

    /**
     * check phone is unique
     * @param item the phone number
     */
    checkPhoneIsUnique(item: IClientModel, isAdd: boolean, callback) {
        this.subs.sink = this.clientsService.IsUniquePhone(item.phoneNumber).subscribe((result) => {
            if (result.status === ResultStatus.Succeed &&
                !result.value &&
                (isAdd ? true : this.client.phoneNumber !== item.phoneNumber)) {
                this.toastService.error(this.translate.instant('ERRORS.PHONE_NOT_UNIQUE'));
                callback(false);
                return;
            }
            callback(true);
        });
    }

    //#endregion

    //#region services

    /**
     * get list client paged
     * @param filter display all client
     */
    getClients(filter: IClientFilterOption) {
        this.clientsService.GetAsPagedResult(filter)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.clients = result;
                    this.filterOption = filter;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get client by id
     * @param id the id of entity client
     */
    getClientById(id: string, callback: (client: IClient) => void) {
        this.clientsService.Get(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * Add client action
     */
    addClient(clientModel: IClientModel) {
        this.checkReferenceIsUnique(clientModel, true, (checkResult: boolean) => {
            if (checkResult) {
                this.checkPhoneIsUnique(clientModel, true, (checkResultPhone: boolean) => {
                    if (checkResultPhone) {
                        this.clientsService.Add(clientModel).subscribe(result => {
                            if (result.hasValue) {
                                this.toastAddSuccess();
                                this.showEvent(result.value.id);
                            } else {
                                this.toastErrorServer();
                            }
                        });
                    }
                })
            }
        });
    }

    /**
     * add memo to client
     * @param memo the memo to add
     */
    saveMemoToClient(memos: Memo[]) {
        this.subs.sink = this.clientsService.SaveMemos(this.client.id, memos).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastSaveSuccess();
                this.client.memos = memos;
            }
        });
    }

    /**
     * update client
     */
    updateClient(clientModel: IClientModel) {
        this.checkReferenceIsUnique(clientModel, false, (checkResult: boolean) => {
            if (checkResult) {
                this.checkPhoneIsUnique(clientModel, false, (checkResultPhone: boolean) => {
                    if (checkResultPhone) {
                        this.clientsService.Update(this.client.id, clientModel).subscribe(result => {
                            if (result.hasValue) {
                                this.toastEditSuccess();
                                this.showEvent(result.value.id);
                            } else {
                                this.toastErrorServer();
                            }
                        });
                    }
                })
            }
        });
    }

    /**
     * delete client
     */
    deleteClient(id: string) {
        this.subs.sink = this.clientsService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getClients(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * send SMS
     * @param smsModel the SMS model
     */
    sendSMS(smsModel: IEnvoyerSmsModel) {
        smsModel.dossierId = this.client.id;
        this.subs.sink = this.smsService.Send(smsModel)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.client.sms = result.value;
                } else {
                    this.toastErrorServer();
                }
            }, err => {
                this.toastErrorServer();
            });
    }

    /**
     * get SMS as paged result
     */
    getSMS(id: string, callback): void {
        this.smsFilterOption.clientId = id;
        this.smsService.GetAsPagedResult(this.smsFilterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get all situation result as page result
     */
    getSituation(filter: IDashboardFilterOption) {
        filter.clientId = this.client.id;
        this.dashboardService.GetCountDossiers(filter).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.numberOfFolder = result.value;

            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get chiffre affaire
     */
    getChiffreAffaire(filter: IDashboardFilterOption) {
        filter.clientId = this.client.id;
        this.subs.sink = this.dashboardService.GetChiffreAffaire(filter).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.chiffreAffaireStatistics = result.value;
            } else {
                this.toastErrorServer();
            }
        });
    }

    //#endregion

    //#region events

    /**
     * add event
     */
    addEvent() {
        this.client = null;
        this.initForm();
        this.modeAdd();
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getClientById(id, (client) => {
            this.client = client;
            this.getSituation(this.dashboardFilterOption);
            this.initForm();
            this.initLoginForm();
            this.modeShow(id);
        });
    }

    /**
     * edit event
     */
    editEvent(id: string) {
        this.getClientById(id, (client) => {
            this.client = client;
            this.initForm();
            this.modeEdit(id);
        });
    }

    //#endregion
}
