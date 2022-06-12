import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from 'app/app-settings/app-settings';
import { ResultStatus } from 'app/core/enums/result-status';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IDashboardFilterOption, IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { ILoginCreateModel } from 'app/pages/users/user.model';
import { UsersService } from 'app/pages/users/users.service';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { IAgence, IAgenceModel, IChangeActivateAgenceModel } from '../../agence.model';
import { AgenceService } from '../../agence.service';
import { UserHelper } from 'app/core/helpers/user';
import { NumerationService } from 'app/pages/parametres/numerotation/numerotation.service';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { StringHelper } from 'app/core/helpers/string';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { IChartData } from 'app/pages/dashboard/dashboard.model';
import { DashboardService } from 'app/pages/dashboard/dashboard.service';
import { SortDirection } from 'app/core/enums/sort-direction';
import { DateHelper } from 'app/core/helpers/date';
import { Memo } from 'app/core/models/general/memo.model';

@Component({
    selector: 'kt-agence-shell',
    templateUrl: './agence-shell.component.html'
})
export class AgenceShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** the list of agence */
    agences: IPagedResult<IAgence>;

    /** the current agence */
    agence: IAgence;

    /** the filter option */
    filterOption: IFilterOption = {
        OrderBy: 'createOn',
        SortDirection: SortDirection.Desc,
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    /** the form of agence */
    form: FormGroup;

    /** the form login */
    formLogin: FormGroup;

    /** chiffre d'affaire agence */
    chiffreAffaireStatistics: IChartData;

    /** the number of folder for agence */
    numberOfFolder: number;

    dashboardFilterOption: IDashboardFilterOption = {
        ...this.filterOption,
        dateTo: DateHelper.formatDateTime(DateHelper.getLastDayInTheCurrentYear()),
        dateFrom: DateHelper.formatDateTime(DateHelper.getFirstDayInTheCurrentYear()),
    };

    constructor(
        protected translate: TranslateService,
        protected toastService: ToastService,
        protected router: Router,
        protected route: ActivatedRoute,
        private translationService: TranslationService,
        private numerationService: NumerationService,
        private agenceService: AgenceService,
        private usersService: UsersService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private dashboardService: DashboardService
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Agences);
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
     * initialization form
     */
    initForm() {
        this.form = this.fb.group({
            reference: [null, [Validators.required]],
            raisonSociale: [null, [Validators.required]],
            formeJuridique: [null],
            capital: [null],
            numeroTvaINTRA: [null],
            siret: [null],
            email: [null, [Validators.pattern(AppSettings.regexEmail)]],
            phoneNumber: [null, Validators.pattern(AppSettings.regexPhone)],
            codeComptable: [null, [Validators.required]],
            dateDebutActivite: [null],
            dateFinActivite: [null],
            regulationModeId: [null]
        });
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

    //#endregion

    // #region services

    /**
     * get agence as paged
     */
    getAgences(filterOption: IFilterOption) {
        this.subs.sink = this.agenceService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.filterOption = filterOption;
                    this.agences = result;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get agence by id
     * @param id the id of entity agence
     */
    getAgenceById(id: string, callback: (agence: IAgence) => void) {
        this.agenceService.Get(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * generate reference agence
     */
    generateReference() {
        this.subs.sink = this.numerationService
            .GenerateNumerotation(NumerationType.AGENCE)
            .subscribe(item => {
                if (item.status === ResultStatus.Succeed) {
                    this.form.get('reference').setValue(item.value);
                }
            });
    }

    /**
     * check reference is unique
     */
    CheckReferenceIsUnique(agenceModel: IAgenceModel, isAdd: boolean, callback) {
        this.subs.sink = this.agenceService.IsReferenceUnique(agenceModel.reference)
            .subscribe((result) => {

                if (result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.agence.reference !== agenceModel.reference)
                ) {
                    this.toastService.error(this.translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'));
                    callback(false);
                    return;
                }

                callback(true);
            });
    }

    /**
     * add new agence
     */
    addAgence(agenceModel: IAgenceModel) {
        agenceModel.isActive = true;
        this.CheckReferenceIsUnique(agenceModel, true, (checkResult: boolean) => {
            if (checkResult) {
                this.agenceService.Add(agenceModel)
                    .subscribe(result => {
                        if (result.status === ResultStatus.Succeed) {
                            this.toastAddSuccess();
                            this.getAgences(this.filterOption);
                            this.modeList();
                        } else {
                            this.toastErrorServer();
                        }
                    });
            }
        });
    }

    /**
     * edit agence
     */
    editAgence(agence: IAgenceModel) {
        this.CheckReferenceIsUnique(agence, false, (checkResult: boolean) => {
            if (checkResult) {
                this.agenceService.Update(this.agence.id, agence).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastEditSuccess();
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * delete agence
     */
    deleteEvent(id: string) {
        this.subs.sink = this.agenceService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getAgences(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * change activate agence
     */
    ChangeActivateAgenceEvent(changeModel: IChangeActivateAgenceModel) {
        this.subs.sink = this.agenceService.ChangeActivateAgence(changeModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.updateActive(changeModel.id, result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get chiffre affaire
     */
    getChiffreAffaire(filter: IDashboardFilterOption) {
        filter.agenceId = this.agence.id;
        this.subs.sink = this.dashboardService.GetChiffreAffaire(filter).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.chiffreAffaireStatistics = result.value;
            } else {
                this.toastErrorServer();
            }
        });
    }


    /**
     * get all situation result as page result
     */
    getSituation(filter: IDashboardFilterOption) {
        filter.agenceId = this.agence.id;
        this.dashboardService.GetCountDossiers(filter).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.numberOfFolder = result.value;

            } else {
                this.toastErrorServer();
            }
        });
    }

    // #endregion

    // #region memos

    /**
     * add memo to agence object
     */
    saveMemoToAgence(memos: Memo[]) {
        this.subs.sink = this.agenceService.SaveMemos(this.agence.id, memos).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastSaveSuccess();
                this.agence.memos = memos;
            }
        });
    }

    // #endregion

    // #region events

    /**
     * add event
     */
    addEvent() {
        this.agence = null;
        this.initForm();
        this.generateReference();
        this.modeAdd();
    }

    /**
     * edit event
     */
    editEvent(id: string) {
        this.getAgenceById(id, (agence) => {
            this.agence = agence;
            this.initForm();
            this.modeEdit(id);
        });
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getAgenceById(id, (agence) => {
            this.agence = agence;
            this.getSituation(this.dashboardFilterOption);
            this.initForm();
            this.initLoginForm();
            this.modeShow(id);
        });
    }

    // #endregion

    // #region helpers

    // #endregion

    //#region access application

    /**
     * update active agence
     */
    updateActive(agenceId: string, isActive: boolean) {
        const agenceIndex = this.agences.value.findIndex(e => e.id === agenceId);
        this.agences.value[agenceIndex].isActive = isActive;
        this.agences = JSON.parse(JSON.stringify(this.agences));
    }

    /**
     * add login for agence
     */
    addLogin(userLogin: ILoginCreateModel) {
        userLogin.id = this.agence.id;
        UserHelper.checkUsernameIsUnique(
            this.subs,
            this.usersService,
            this.toastService,
            this.translate,
            null,
            userLogin,
            (resultCheck) => {
                if (resultCheck) {
                    this.agenceService.CreateLogin(userLogin).subscribe(result => {
                        if (result.status === ResultStatus.Succeed) {
                            this.toastAddSuccess();
                            this.agence.agenceLogin = result.value;
                        } else {
                            this.toastErrorServer();
                        }
                    });
                }
            });
    }
    /**
     * edit login
     */
    editLogin(userLogin: ILoginCreateModel) {
        UserHelper.checkUsernameIsUnique(
            this.subs,
            this.usersService,
            this.toastService,
            this.translate,
            this.agence.agenceLogin.userName,
            userLogin,
            (resultCheck) => {
                if (resultCheck) {
                    userLogin.id = this.agence.agenceLogin.id;
                    this.usersService.UpdateUserLogin({ ...userLogin }).subscribe(result => {
                        if (result.status === ResultStatus.Succeed) {
                            this.toastEditSuccess();
                        } else {
                            this.toastErrorServer();
                        }
                    });
                    this.usersService.UpdateUserPassword(userLogin.id, userLogin.password).subscribe(result => {
                        if (result.status === ResultStatus.Succeed) {
                            this.toastEditSuccess();
                        } else {
                            this.toastErrorServer();
                        }
                    });
                }
            });
    }

    //#endregion
}
