import { Component, OnInit, Inject } from '@angular/core';
import { SubSink } from 'subsink';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IAvoirFilterOption } from 'app/core/models/general/filter-option.model';
import { SortDirection } from 'app/core/enums/sort-direction';
import { AppSettings } from 'app/app-settings/app-settings';
import { IAvoir } from 'app/pages/avoir/avoir.model';
import { IFacture } from 'app/pages/facture/facture.model';
import { ToastService } from 'app/core/layout/services/toast.service';
import { AvoirService } from 'app/pages/avoir/avoir.service';
import { ResultStatus } from 'app/core/enums/result-status';
import { PaimentType } from 'app/core/enums/paiment-type.enum';
import { IPaiementModel } from 'app/pages/paiement/paiement.model';
import { UserHelper } from 'app/core/helpers/user';
import { AvoirStatus } from 'app/core/enums/avoir-status.enum';
import { DateHelper } from 'app/core/helpers/date';

@Component({
    selector: 'kt-paiement-by-avoir',
    templateUrl: './paiement-by-avoir.component.html'
})
export class PaiementByAvoirComponent implements OnInit {

    subs = new SubSink();

    /** search form control */
    searchControl = new FormControl();

    /** page count */
    pageCount = 1;

    /** page current */
    page = 1;

    /** the filter option */
    filterOption: IAvoirFilterOption = {
        OrderBy: 'createdOn',
        SortDirection: SortDirection.Asc,
        Page: this.page,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    /** list of avoirs */
    avoirs: IAvoir[] = [];

    /** rest to pay */
    restToPaye: number;

    /** facture */
    facture: IFacture;

    /** title */
    title: string;

    constructor(
        public dialogRef: MatDialogRef<PaiementByAvoirComponent>,
        private toastService: ToastService,
        private avoirService: AvoirService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            facture: IFacture,
            restToPaye: number,
            title: string
        }
    ) { }

    ngOnInit() {
        if (this.data) {
            this.facture = this.data.facture;
            this.restToPaye = this.data.restToPaye;
            this.title = this.data.title;
        }
        this.initializeComponent('');
        this.subscribeSearchControl();
    }
    /**
     * subscribe changes of search control
     */
    subscribeSearchControl() {
        this.subs.sink = this.searchControl.valueChanges
            .pipe(debounceTime(700),
                distinctUntilChanged())
            .subscribe(result => {
                this.initializeComponent(result);
            });
    }

    /**
     * initialize parameters of component
     * @param searchQuery the search query
     */
    initializeComponent(searchQuery: string) {
        this.filterOption.Page = 1;
        this.filterOption.SearchQuery = searchQuery;
        this.filterOption.clientId = this.facture.clientId;
        this.filterOption.status = [AvoirStatus.ENCOURS];
        this.getListAvoir(this.filterOption);
    }

    /**
     * get list of avoirs
     */
    getListAvoir(filterOption: IAvoirFilterOption) {
        this.subs.sink = this.avoirService.GetAsPagedResult(filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.avoirs = result.value;
                this.pageCount = result.pageCount;
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /** load more avoirs */
    loadMore() {
        if (this.pageCount <= this.page) { return; }
        this.page++;
        this.getListAvoir(this.filterOption);
    }

    /** select avoir */
    selectAvoir(index: number) {
        this.avoirs.map(x => x['checked'.toString()] = false);
        this.avoirs[index]['checked'.toString()] = true;
    }

    /** save paiement by avoir */
    savePaiementByAvoir() {
        const selectedAvoir = this.avoirs.find(e => e['checked'.toString()] === true);
        if (selectedAvoir != null) {
            // montant
            const montant = Math.abs(selectedAvoir.totalTTC) > this.restToPaye ? this.restToPaye : Math.abs(selectedAvoir.totalTTC);
            // format payment model
            const paiementModel: IPaiementModel = {
                montant,
                avoirId: selectedAvoir.id,
                regulationModeId: 'RegulationMode::7',
                agenceId: UserHelper.getAgenceId(),
                type: PaimentType.BY_AVOIR,
                createAvoir: false,
                description: `Paiement facture ${this.facture.reference}`,
                datePaiement: DateHelper.formatDate(new Date().toString()) as any,
                facturePaiements: [
                    {
                        factureId: this.facture.id,
                        montant
                    }
                ]
            };
            this.dialogRef.close(paiementModel);
        } else {
            this.dialogRef.close(true);
        }
    }

}
