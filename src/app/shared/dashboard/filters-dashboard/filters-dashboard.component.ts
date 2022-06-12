import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PeriodeComptableFilter } from 'app/core/enums/periode-comptable.enum';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { DateHelper } from 'app/core/helpers/date';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { IDashboardFilterOption } from 'app/core/models/general/filter-option.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'kt-filters-dashboard',
    template: `
        <div class="d-flex flex-row-reverse align-items-center bd-highlight">

            <button mat-icon-button [matMenuTriggerFor]="menu2" >
                <mat-icon>filter_list</mat-icon>
            </button>

            <div *ngIf="dashboardFilterOption.period == periods.Interval">
                {{ dashboardFilterOption.dateFrom | date:'shortDate' }} - {{ dashboardFilterOption.dateTo | date:'shortDate' }}
            </div>

            <div *ngIf="dashboardFilterOption.period != periods.Interval">
                {{ 'PERIOD_COMPTABLE.'+dashboardFilterOption.period | translate }}
            </div>

            <mat-menu #menu2="matMenu">
                <div class="px-3 pt-2 pb-1">


                    <!-- filter by period-->
                    <kt-custom-drop-down
                        class="custom"
                        (click)="$event.stopPropagation()"
                        [showAny]="false"
                        [inputName]="'period'"
                        [data]="periodeComptable"
                        [label]="'LABELS.PERIOD_FILTER' | translate"
                        [formInstant]="form">
                    </kt-custom-drop-down>

                    <ng-container *ngIf="showInterval" >

                        <!-- filtre by date minimal-->
                        <kt-custom-date-picker
                            class="custom"
                            (click)="$event.stopPropagation()"
                            [formInstant]="form"
                            [inputName]="'dateFrom'"
                            [label]="'LABELS.DATE_MINIMAL' | translate">
                        </kt-custom-date-picker>

                        <!-- filtre by date maximal-->
                        <kt-custom-date-picker
                            class="custom"
                            (click)="$event.stopPropagation()"
                            [formInstant]="form"
                            [inputName]="'dateTo'"
                            [label]="'LABELS.DATE_MAXIMAL' | translate">
                        </kt-custom-date-picker>

                    </ng-container>

                    <ng-container *ngIf="showFilterClient">
                        <!-- filter by client -->
                        <kt-client-dropdown
                            (click)="$event.stopPropagation()"
                            class="custom"
                            [inputName]="'clientId'"
                            [label]="'LABELS.CLIENT' | translate"
                            [formInstant]="form">
                        </kt-client-dropdown>
                    </ng-container>

                    <div class="d-flex flex-row-reverse custom" >
                        <button mat-raised-button (click)="search()" color="primary">
                            {{ 'LABELS.SEARCH' | translate }}
                        </button>
                    </div>
                </div>
            </mat-menu>

        </div>
    `
})

export class FiltersDashboardComponent implements OnInit {

    @Output()
    searchEvent = new EventEmitter<IDashboardFilterOption>();

    @Input()
    showFilterClient = true;

    form: FormGroup;
    dashboardFilterOption: IDashboardFilterOption;
    periodeComptable: IDropDownItem<number, string>[] = [];
    periods = PeriodeComptableFilter;
    showInterval = true;

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.initializeForm();
        this.chargeAccountingPeriod();
        this.search();
    }

    initializeForm() {
        this.form = this.fb.group({
            period: [PeriodeComptableFilter.Interval],
            clientId: [null],
            dateFrom: [new Date(DateHelper.getFirstDayInTheCurrentYear())],
            dateTo: [new Date(DateHelper.getLastDayInTheCurrentYear())]
        });
        this.form.get('period')
            .valueChanges
            .pipe(debounceTime(500), distinctUntilChanged())
            .subscribe(result => {
                this.showInterval = result === this.periods.Interval;
            })
    }

    search() {
        const values = this.form.value;
        this.dashboardFilterOption = {
            dateFrom: values?.dateFrom,
            dateTo: values?.dateTo,
            clientId: values?.clientId,
            period: values?.period,
        };
        this.searchEvent.emit(this.dashboardFilterOption);
    }

    chargeAccountingPeriod() {
        this.periodeComptable = ConversionHelper.convertEnumToListKeysValues(PeriodeComptableFilter, 'number');
        this.periodeComptable.forEach(e => e.text = `PERIOD_COMPTABLE.${e.value}`);
    }
}
