import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { CopyHelper } from 'app/core/helpers/copy';
import { ITypeLogement, ITypeLogementModel } from '../../type-logement.model';
import { EditTypeLogementComponent } from '../../components/edit-type-logement/edit-type-logement.component';
import { TypeLogementService } from '../../type-logement.service';
import { Router } from '@angular/router';

@Component({
    selector: 'kt-product-category-shell',
    templateUrl: './type-logement-shell.component.html'
})
export class TypeLogementShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** list of type logement */
    typeLogements: IPagedResult<ITypeLogement>;

    /** the current type logement */
    typeLogement: ITypeLogement;

    /** the filter option */
    filterOption: IFilterOption;

    /** the form group */
    form: FormGroup;


    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private typeLogementService: TypeLogementService,
        protected toastService: ToastService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.TypeLogement);
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    //#region form

    /**
     * initialization form
     */
    initForm() {
        this.form = this.fb.group({
            name: [null, [Validators.required]],
        });
    }

    //#endregion

    // #region services

    /**
     * get type logement as paged
     */
    getTypeLogment(filterOption: IFilterOption) {
        this.subs.sink = this.typeLogementService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.filterOption = filterOption;
                this.typeLogements = result;
            });
    }

    /**
     * check username and password are unique
     * @param callback the callback
     */
    CheckReferenceIsUnique(typeLogementModel: ITypeLogementModel, isAdd: boolean, callback) {
        this.subs.sink = this.typeLogementService.IsUniqueName(typeLogementModel.name)
            .subscribe((result) => {
                if (
                    result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.typeLogement.name !== typeLogementModel.name)
                ) {
                    this.toastService.error(this.translate.instant('ERRORS.NAME_NOT_UNIQUE'));
                    callback(false);
                    return;
                }
                callback(true);
                return;
            });
    }


    /**
     * add new type logement
     */
    addTypeLogement(typeLogementModel: ITypeLogementModel) {
        this.CheckReferenceIsUnique(typeLogementModel, true, (checkResult) => {
            if (checkResult) {
                this.typeLogementService.Add(typeLogementModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.getTypeLogment(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * edit type logement
     */
    editTypeLogement(typeLogement: ITypeLogementModel) {
        this.CheckReferenceIsUnique(typeLogement, false, (checkResult: boolean) => {
            if (checkResult) {
                this.typeLogementService.Update(this.typeLogement.id, typeLogement)
                    .subscribe(result => {
                        if (result.status === ResultStatus.Succeed) {
                            this.typeLogements.value[this.getIndexCurrentTypaLogement()] = result.value;
                            this.typeLogements = CopyHelper.copy(this.typeLogements);
                            this.toastEditSuccess();
                        } else {
                            this.toastErrorServer();
                        }
                    });
            }
        });
    }

    /**
     * delete type logement
     */
    deleteEvent(id: string) {
        this.subs.sink = this.typeLogementService.Delete(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.toastDeleteSuccess();
                    this.getTypeLogment(this.filterOption);
                    this.modeList();
                } else {
                    this.toastErrorServer();
                }
            });
    }

    // #endregion

    // #region events

    /**
     * add event
     */
    addEvent() {
        this.typeLogement = null;
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditTypeLogementComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addTypeLogement(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(typeLogement: ITypeLogement) {
        this.typeLogement = this.typeLogements.value.find(e => e.id === typeLogement.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditTypeLogementComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Edit,
            typeLogement: this.typeLogement,
        }).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.editTypeLogement(result);
            }
        });
    }

    /**
     * show event
     */
    showEvent(typeLogement: ITypeLogement) {
        this.typeLogement = this.typeLogements.value.find(e => e.id === typeLogement.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditTypeLogementComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            typeLogement: this.typeLogement,
            mode: ModeEnum.Show
        });
    }

    // #endregion

    // #region helpers

    /**
     * get index of current type logement
     */
    getIndexCurrentTypaLogement(): number {
        return this.typeLogements.value.findIndex(e => e.id === this.typeLogement.id);
    }

    // #endregion

}
