import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IArticle } from 'app/core/models/general/article.model';
import { AvoirStatus } from 'app/core/enums/avoir-status.enum';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { IResultCalculationModel } from 'app/core/models/general/calculation.model';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IMatMenuItem } from 'app/shared/ui-material-elements/custom-mat-menu/custom-mat-menu.component';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { IAvoirModel, IAvoir } from '../../avoir.model';
import { UserHelper } from 'app/core/helpers/user';

@Component({
    selector: 'kt-avoir-edit',
    templateUrl: './edit.component.html',
    styles: []
})
export class EditComponent extends BaseEditTemplateComponent<IAvoirModel> {

    @Output() downloadEvent = new EventEmitter();
    @Output() dupliquerEvent = new EventEmitter();
    @Output() printEvent = new EventEmitter();
    @Output() displayFileEvent = new EventEmitter();

    @Input()
    set Avoir(value: IAvoir) {
        if (value != null) {
            this.avoir = value;
            this.articles = value.articles;
            this.remise = value.remise;
            this.relatedDocs = value.documentAssociates;
            this.remiseType = value.remiseType;
            this.menuItems = this.getMenuItems();
        }
    }

    /** the enumeration of status */
    status = AvoirStatus;

    /** list of articles */
    articles: IArticle[] = [];

    /** the result of calculation */
    resultCalculation: IResultCalculationModel;

    /** type of remise */
    remiseType = RemiseType.Percent;

    /** remise */
    remise = 0;

    /** avoir */
    avoir: IAvoir;

    menuItems: IMatMenuItem[] = [];

    constructor(
        private translate: TranslateService,
        private toastService: ToastService,
    ) {
        super();
        this.setModule(this.modules.Avoir);
    }

    /**
     * set result calculation
     */
    setResultCalculation(resultCalculation: IResultCalculationModel) {
        this.resultCalculation = resultCalculation;
    }
    /**
     * save changes
     */
    save(status: AvoirStatus) {
        if (this.form.valid) {
            if (this.resultCalculation.articles.length > 0) { }
            if (status !== AvoirStatus.BROUILLON && this.resultCalculation?.articles?.length === 0) {
                this.toastService.warning(this.translate.instant('ERRORS.ADD_LEAST_ARTICLE'));
                return;
            }
            if (this.isEditMode()) {
                this.editEvent.emit(this.buildAvoirObject(status));
            } else {
                this.addEvent.emit(this.buildAvoirObject(status));
            }
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /**
     * build avoir object
     */
    buildAvoirObject(status: AvoirStatus): IAvoirModel {
        const avoir: IAvoirModel = { ...this.form.getRawValue() };
        avoir.totalHT = this.resultCalculation.remise > 0 ? this.resultCalculation.totalHTRemise : this.resultCalculation.totalHT;
        avoir.remise = this.resultCalculation.remise;
        avoir.totalTTC = this.resultCalculation.totalTTC,
            avoir.remiseType = this.resultCalculation.remiseType;
        avoir.status = status;
        avoir.agenceId = UserHelper.getAgenceId();
        avoir.articles = this.resultCalculation.articles;
        return avoir;
    }

    //#region helpers

    /**
     * menu items of actions
     */
    getMenuItems() {
        const items: IMatMenuItem[] = [
            {
                appear: true,
                action: () => this.dupliquerEvent.emit(this.avoir),
                icon: 'content_copy',
                title: 'LABELS.DUPLIQUER'
            },
            {
                appear: true,
                action: () => this.displayFile(),
                icon: 'remove_red_eye',
                title: 'TITLES.PREVIEW_FILE'
            },
            {
                appear: true,
                action: () => this.printEvent.emit(),
                icon: 'print',
                title: 'LABELS.IMPRIMER'
            },
            {
                appear: true,
                action: () => this.downloadEvent.emit(),
                icon: 'description',
                title: 'LABELS.DOWNLOAD'
            },
        ];
        return items;
    }
    //#endregion

    //#region event emitter

    displayFile() {
        this.displayFileEvent.emit()
    }

    //#endregion
}
