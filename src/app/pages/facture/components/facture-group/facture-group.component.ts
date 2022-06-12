import { Component, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/core/layout/services/toast.service';
import { DevisService } from 'app/pages/devis/devis.service';
import { DevisStatus } from 'app/core/enums/devis-status.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { SortDirection } from 'app/core/enums/sort-direction';
import { AppSettings } from 'app/app-settings/app-settings';
import { IDevis } from 'app/pages/devis/devis.model';
import { IDevisFilterOption } from 'app/core/models/general/filter-option.model';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { ClientType } from 'app/core/enums/client-type.enum';

@Component({
    selector: 'kt-facture-group',
    templateUrl: './facture-group.component.html'
})
export class FactureGroupComponent implements OnInit {

    subs = new SubSink();

    /** form group */
    form: FormGroup;

    /** select list of clients */
    stepClient = true;

    /** select Devis */
    stepDevis = false;

    /** page count */
    pageCount = 1;

    /**
     * the filter option of Devis
     */
    filterOption: IDevisFilterOption = {
        OrderBy: 'createdOn',
        SortDirection: SortDirection.Asc,
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: '',
        status: [DevisStatus.Valider, DevisStatus.Signe]
    };

    /**
     * search form control
     */
    searchControl = new FormControl();

    /** fiche Interventions list */
    devis: IDevis[] = [];

    /** clientId */
    clientId: number;

    /** the type of client */
    clientType = ClientType;

    constructor(
        public dialogRef: MatDialogRef<FactureGroupComponent>,
        private fb: FormBuilder,
        private translate: TranslateService,
        private toastService: ToastService,
        private devisService: DevisService) {
        this.form = this.fb.group({
            clientId: [null, [Validators.required]],
        });
    }

    ngOnInit() {
        this.initializeComponent('');
        this.subscribeSearchControl();
    }

    /**
     * change value of steps
     * @param val the value of steps
     */
    changeValueStep(val: { stepClient: boolean, stepDevis: boolean }) {
        this.stepClient = val.stepClient;
        this.stepDevis = val.stepDevis;
    }

    /**
     * go to next step
     */
    next() {
        if (this.stepClient) {
            this.changeValueStep({ stepClient: false, stepDevis: true });
            this.goToStepDevis();
        } else if (this.stepDevis) {
            if (this.devis.length > 0) {
                this.devis = this.devis.filter(e => e['checked'.toString()]);
                this.dialogRef.close(this.devis);
            }
        }
    }

    /**
     * go to step devis
     */
    goToStepDevis() {
        if (this.form.valid) {
            this.changeValueStep({ stepClient: false, stepDevis: true });
            this.filterOption.clientId = this.form.controls.clientId.value;
            this.filterOption.status = [DevisStatus.Valider, DevisStatus.Signe];
            this.filterOption.type = DevisType.Normal;
            this.getDevis(this.filterOption);
            this.form.reset();
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /** get devis as pages result */
    getDevis(filterOption: IDevisFilterOption) {
        this.subs.sink = this.devisService.GetAsPagedResult(filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.devis = result.value;
                this.pageCount = result.pageCount;
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * subscribe changes of search control
     */
    subscribeSearchControl() {
        this.subs.sink = this.searchControl.valueChanges
            .pipe(debounceTime(700), distinctUntilChanged())
            .subscribe(result => {
                this.initializeComponent(result);
                this.getDevis(this.filterOption);
            });
    }

    /**
     * initialize parameters of component
     * @param searchQuery the search query
     */
    initializeComponent(searchQuery: string) {
        this.filterOption.Page = 1;
        this.filterOption.SearchQuery = searchQuery;
    }

    /**
     *
     * reinitialize steps
     */
    reinitialize() {
        this.changeValueStep({ stepClient: true, stepDevis: false });
    }

    /**
     * load more data
     */
    loadMore() {
        if (this.pageCount > this.filterOption.Page) {
            this.filterOption.Page++;
            this.getDevis(this.filterOption);
        }
    }
}
