import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { IChampSiteInstallation, IChampSiteInstallationModel } from '../champ-site-installation.model';
import { ChampSiteInstallationService } from '../champ-site-installation.service';
import { EditChampComponent } from '../components/edit-champ/edit-champ.component';

@Component({
    selector: 'kt-champ-site-installation-shell',
    templateUrl: './champ-site-installation-shell.component.html'
})
export class ChampSiteInstallationShellComponent extends BaseContainerTemplateComponent implements OnInit {

    champs: IPagedResult<IChampSiteInstallation>;
    champ: IChampSiteInstallation;
    form: FormGroup;
    filterOption: IFilterOption;

    constructor(
        private fb: FormBuilder,
        private service: ChampSiteInstallationService,
        protected translate: TranslateService,
        private translationService: TranslationService,
        protected toastService: ToastService,
        private dialogMat: MatDialog,
        protected router: Router
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.ChampSiteInstallation);
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    /**
     * initialization form
     */

    initializationForm() {
        this.form = this.fb.group({
            name: [null, [Validators.required]],
        });
    }

    // #region services

    /**
     * get champs as page
     */
    getChamps(filterOption: IFilterOption) {
        this.subs.sink = this.service.GetAsPagedResult(filterOption).subscribe(result => {
            this.champs = result;
            this.filterOption = filterOption;
        });
    }

    /**
     * check username and password are unique
     * @param callback the callback
     */
    checkReferenceIsUnique(champModel: IChampSiteInstallationModel, isAdd: boolean, callback: (result: boolean) => void) {
        this.subs.sink = this.service.IsUniqueName(champModel.name).subscribe(
            result => {
                if (result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.champ.name !== champModel.name)) {
                    this.toastService.error(this.translate.instant('ERRORS.NAME_NOT_UNIQUE'));
                    callback(false);
                    return;
                }
                callback(true);
            });
    }

    /**
     * add new champ
     */
    addChamp(model: IChampSiteInstallationModel) {
        this.checkReferenceIsUnique(model, true, (checkUnique) => {
            if (checkUnique) {
                this.service.Add(model).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.getChamps(this.filterOption);
                        this.mode = ModeEnum.List;
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * update champ
     */
    updateChamp(model: IChampSiteInstallationModel) {
        this.checkReferenceIsUnique(model, false, (checkUnique) => {
            if (checkUnique) {
                this.service.Update(this.champ.id, model).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastEditSuccess();
                        this.getChamps(this.filterOption);
                        this.mode = ModeEnum.List;
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * delete champ
     */
    deleteChamp(id: string) {
        this.service.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getChamps(this.filterOption);
                this.mode = ModeEnum.List;
            } else {
                this.toastErrorServer();
            }
        });

    }

    // #endregion

    //region events

    /**
     * add event
     */
    addEvent() {
        this.champ = null;
        this.initializationForm();
        DialogHelper.openDialog(this.dialogMat, EditChampComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addChamp(result);
            }
        });

    }

    /**
     * edit champ
     */
    editEvent(model: IChampSiteInstallation) {
        this.champ = this.champs.value.find(e => e.id === model.id);
        this.initializationForm();
        DialogHelper.openDialog(this.dialogMat, EditChampComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Edit,
            champModel: this.champ
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.updateChamp(result);
            }
        });
    }

    // #endregion

}
