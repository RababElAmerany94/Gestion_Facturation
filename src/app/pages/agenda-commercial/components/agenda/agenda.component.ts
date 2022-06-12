import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { timer } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { IAgendaModel, IChangeDateEventModel } from '../../agenda-commercial.model';
import { OutputFilterAgendaCommercial } from '../filter-agenda-comercial/filter-agenda-comercial.component';
import { AppSettings } from './../../../../app-settings/app-settings';
import { EchangeCommercialType } from './../../../../core/enums/echange-commercial-type.enum';
import { DialogHelper } from './../../../../core/helpers/dialog';
import { ToastService } from './../../../../core/layout/services/toast.service';
import { AgendaCommercialService } from './../../agenda-commercial.service';
import { ResultStatus } from 'app/core/enums/result-status';
import { SortDirection } from 'app/core/enums/sort-direction';
import { DateHelper } from 'app/core/helpers/date';
import { StringHelper } from 'app/core/helpers/string';
import { IEchangeCommercialFilterOption } from 'app/core/models/general/filter-option.model';

export interface EventColor {
    primary: string;
    secondary: string;
}

@Component({
    selector: 'kt-agenda',
    templateUrl: './agenda.component.html',
    providers: [DatePipe],
})
export class AgendaComponent implements OnDestroy {

    subSink = new SubSink();

    @Output()
    showEvent = new EventEmitter<string | number>();

    @Output()
    editEvent = new EventEmitter<IAgendaModel>();

    @Output()
    updateDateEvent = new EventEmitter<IChangeDateEventModel>();

    @Output()
    addEvent = new EventEmitter<IAgendaModel>();

    /** the choice client */
    @Input()
    clientId: string;

    /** the choice dossier */
    @Input()
    dossierId: string;

    /** the agenda refresh */
    @Input()
    set getAgendaRefresh(value: boolean) {
        if (value === true) {
            this.refresh();
        }
    }

    view: CalendarView = CalendarView.Month;
    calendarView = CalendarView;
    viewDate: Date = new Date();
    activeDayIsOpen = true;
    colors: { red: EventColor, blue: EventColor, yellow: EventColor } = {
        red: {
            primary: '#ad2121',
            secondary: '#FAE3E3',
        },
        blue: {
            primary: '#1e90ff',
            secondary: '#D1E8FF',
        },
        yellow: {
            primary: '#e3bc08',
            secondary: '#FDF1BA',
        }
    };
    actions: CalendarEventAction[] = [
        {
            label: '<i class="fas fa-fw fa-pencil-alt"></i>',
            a11yLabel: 'Edit',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            },
        },
        {
            label: '<i class="fas fa-fw fa-trash-alt"></i>',
            a11yLabel: 'Delete',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Deleted', event);
            },
        },
    ];
    events: CalendarEvent[] = [];

    /** filter options */
    filterOption: IEchangeCommercialFilterOption = {
        Page: 1,
        PageSize: AppSettings.MAX_GET_DATA,
        OrderBy: 'dateEvent',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    typeEchangeCommercial = EchangeCommercialType;

    constructor(
        private matDialog: MatDialog,
        private translate: TranslateService,
        protected toastService: ToastService,
        private commercialExchangeService: AgendaCommercialService,
        private datePipe: DatePipe
    ) { }

    ngOnDestroy(): void {
        this.subSink.unsubscribe();
    }

    //#region events

    /** search event with filter */
    searchEvent(event: OutputFilterAgendaCommercial) {
        this.filterOption = {
            ...this.filterOption,
            ...event
        };
        this.getCommercialExchange();
    }

    /**
     * triggered when change dates
     * @param event the information range of dates
     */
    onChangeDate(event: { end: Date, start: Date }) {
        this.subSink.sink = timer(500)
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(_ => {
                const dateFrom = DateHelper.formatDate(new Date(event.start).toString()) as any;
                const dateTo = DateHelper.formatDate(new Date(event.end).toString()) as any;
                if (dateFrom !== this.filterOption.dateFrom && dateTo !== this.filterOption.dateTo) {
                    this.filterOption = {
                        ...this.filterOption,
                        dateFrom,
                        dateTo
                    };
                    this.getCommercialExchange();
                }
            })
    }

    /**
     * refresh calendar
     */
    refresh() {
        this.filterOption = {
            Page: 1,
            PageSize: AppSettings.DEFAULT_PAGE_SIZE,
            OrderBy: 'dateEvent',
            SortDirection: SortDirection.Desc,
            SearchQuery: ''
        };
        this.getCommercialExchange();
    }

    //#endregion

    //#region services

    /**
     * get list of commercial exchanges
     */
    getCommercialExchange() {
        if (this.clientId != null) {
            this.filterOption.clientId = this.clientId;
        }
        if (this.dossierId != null) {
            this.filterOption.dossierId = this.dossierId;
        }
        this.subSink.sink = this.commercialExchangeService.GetAsPagedResult(this.filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.events = result.value.map(item => {

                    const startDate = new Date(DateHelper.formatDateTime(item.dateEvent.toString()));
                    const endDate = DateHelper.addTimeToDate(startDate.toString(), item.duree)
                    const defaultEndDate = this.defaultEndDate(new Date(item.dateEvent));

                    const eventModel: CalendarEvent = {
                        meta: item,
                        id: item.id,
                        title: [item?.client?.fullName, item.titre, this.datePipe.transform(startDate, 'short')]
                            .filter(e => e != null)
                            .join(' / '),
                        start: startDate,
                        actions: this.actions,
                        color: this.colorCommercialExchangeType(item.type),
                        draggable: true,
                        resizable: {
                            afterEnd: true,
                            beforeStart: true
                        },
                        end: (
                            !StringHelper.isEmptyOrNull(item.duree) && !item.duree.includes(DateHelper.initTime)
                                ? new Date(endDate)
                                : defaultEndDate
                        )
                    }
                    return eventModel
                })
            }
        })
    };


    /**
     * sync with google agenda
     */
    synchronize() {
        this.subSink.sink = this.commercialExchangeService.SynchronizationWithGoogleCalendar().subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastService.error(this.translate.instant('LABELS.SUCCESS_SYNC'));
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * delete EchangeCommercial
     */
    deleteEchangeCommercial(id: any) {
        this.subSink.sink = this.commercialExchangeService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastService.success(this.translate.instant('SUCCESS.DELETE'));
                this.refresh();
            } else {
                this.toastService.error(this.translate.instant('ERRORS.SERVER'));
            }
        });
    }

    /**
     * delete click
     */
    deleteTache(id: string | number, type: EchangeCommercialType) {
        const name = this.getNameType(type);
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant(`${name}.DELETE.HEADER`),
            message: this.translate.instant(`${name}.DELETE.MESSAGE`),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEchangeCommercial(id);
        });
    }

    /**
     * add type of EchangeCommercialType in agenda
     */
    addClick(type: EchangeCommercialType, date: string) {
        const agendaModel: IAgendaModel = {
            dateEvent: DateHelper.formatDate(date),
            type,
            isFromAgenda: true,
        }
        this.addEvent.emit(agendaModel);
    }

    //#endregion

    //#region helpers

    /**
     * the color of commercial exchange type
     * @param type the type of commercial exchange
     */
    colorCommercialExchangeType(type: EchangeCommercialType): any {
        switch (type) {
            case EchangeCommercialType.Tache:
                return this.colors.red;

            case EchangeCommercialType.RDV:
                return this.colors.blue;

            case EchangeCommercialType.Appel:
                return this.colors.yellow;

            default:
                return this.colors.red;
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

    //#endregion

    //#region view helpers

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    handleEvent(action: string, event: CalendarEvent): void {
        if (action === 'Edited') {
            const agendaModel: IAgendaModel = {
                id: event.id,
                isFromAgenda: true,
            }
            this.editEvent.emit(agendaModel);
        } else if (action === 'Deleted') {
            this.deleteTache(event.id, event.meta.type);
        } else if (action === 'Clicked') {
            this.showEvent.emit(event.id);
        } else if (action === 'Dropped or resized') {
            const eventModel: IChangeDateEventModel = {
                id: event.id,
                dateEvent: DateHelper.formatDate(event.start.toString()),
                time: DateHelper.formatTime(event.start.toDateString()),
                duree: DateHelper.getDurationFromInterval({ start: event.start, end: event.end })
            }
            this.updateDateEvent.emit(eventModel);
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd,
    }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map((item) => {
            if (item === event) {
                const modify = {
                    ...event,
                    start: newStart,
                    end: newEnd,
                };
                this.handleEvent('Dropped or resized', modify);
                return modify;
            }
            return item;
        });

    }

    defaultEndDate(date: Date) {
        date.setHours(23, 59);
        return date;
    }

    //#endregion

}
