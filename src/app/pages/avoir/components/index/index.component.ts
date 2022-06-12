import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { AvoirStatus } from 'app/core/enums/avoir-status.enum';
import { SortDirection } from 'app/core/enums/sort-direction';
import { UserProfile } from 'app/core/enums/user-role.enums';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { DateHelper } from 'app/core/helpers/date';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IconHelpers } from 'app/core/helpers/icon';
import { StringHelper } from 'app/core/helpers/string';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { IAvoirFilterOption, IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { IAvoir, IAvoirDataTables } from '../../avoir.model';

@Component({
    selector: 'kt-avoir-index',
    templateUrl: './index.component.html',
    styles: []
})
export class IndexComponent extends BaseIndexTemplateComponent<IAvoirDataTables, string> implements OnInit {

    @Input()
    set data(values: IPagedResult<IAvoir>) {
        if (values != null) {
            this.avoirs = { ...values as IPagedResult<any> };
            this.avoirs.value = values.value.map<IAvoirDataTables>(e => this.mapIAvoirIntoIAvoirDataTable(e));
        }
    }

    /** the list of avoirs */
    avoirs: IPagedResult<IAvoirDataTables>;

    /** the user profile enumeration */
    userProfile = UserProfile;

    /** filter options */
    filterOptions: IAvoirFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    /** avoirs status */
    avoirsStatus: IDropDownItem<number, string>[] = [];

    /** form */
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private matDialog: MatDialog,
        private translate: TranslateService
    ) {
        super();
        this.initializeForm();
        this.setModule(this.modules.Avoir);
    }

    ngOnInit() {
        this.setColumns();
        this.chargeStatus();
    }
    /**
     * search form initialization
     */
    initializeForm() {
        this.form = this.fb.group({
            status: [null],
            dateFrom: [null],
            dateTo: [null]
        });
    }

    /**
     * set columns
     */
    setColumns() {
        this.columns = [
            {
                name: 'reference',
                nameTranslate: 'LABELS.REFERENCE',
                isOrder: true,
                type: ColumnType.Html
            },
            {
                name: 'status',
                nameTranslate: 'LABELS.STATUS',
                isOrder: true,
                type: ColumnType.Status
            },
            {
                name: 'clientId',
                nameTranslate: 'LABELS.CLIENT',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'dateCreation',
                nameTranslate: 'LABELS.CREATION_DATE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'dateEcheance',
                nameTranslate: 'LABELS.DATE_ECHEANCE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'totalTTC',
                nameTranslate: 'LABELS.TOTAL_TTC',
                isOrder: true,
                type: ColumnType.Currency
            },
        ];
    }

    /**
     * mapping avoir to avoir dataTables
     * @param avoir the avoir information
     */
    mapIAvoirIntoIAvoirDataTable(avoir: IAvoir): IAvoirDataTables {
        const avoirDataTables: IAvoirDataTables = {
            id: avoir.id,
            reference: `${avoir.comptabilise ? IconHelpers.Lock() : ''} ${avoir.reference}`,
            clientId: avoir?.client?.fullName,
            dateCreation: avoir.dateCreation,
            dateEcheance: avoir.dateEcheance,
            status: avoir.status,
            totalTTC: avoir.totalTTC,
            isModify: [AvoirStatus.BROUILLON].includes(avoir.status)
        };

        return avoirDataTables;
    }

    //#region search event

    changeFiltersEvent(dataTableOutput: IFilterOption) {
        this.filterOptions = { ...this.filterOptions, ...dataTableOutput };
        this.filters.emit(this.filterOptions);
    }

    /** search event with filter */
    searchEvent() {
        const values = this.form.value;
        this.filterOptions = {
            ...this.filterOptions,
            status: !StringHelper.isEmptyOrNull(values.status) ? [this.form.get('status').value] : null,
            dateFrom: !StringHelper.isEmptyOrNull(values.dateFrom) ? DateHelper.formatDate(values.dateFrom) as any : null,
            dateTo: !StringHelper.isEmptyOrNull(values.dateTo) ? DateHelper.formatDate(values.dateTo) as any : null,
        };
        this.filters.emit(this.filterOptions);
    }

    //#endregion

    // #region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('LIST.DELETE.HEADER'),
            message: this.translate.instant('LIST.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LA')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }
    //#endregion

    //#region helpers
    /**
     * charge status
     */
    chargeStatus() {
        this.avoirsStatus = ConversionHelper.convertEnumToListKeysValues(AvoirStatus, 'number');
        this.avoirsStatus.forEach(e => e.text = `AVOIR_STATUS.${e.value}`);
    }
    //#endregion
}
