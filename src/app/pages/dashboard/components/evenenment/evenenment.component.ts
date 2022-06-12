import { Component, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { EchangeCommercialStatus } from 'app/core/enums/echange-commercial-status.enum';
import { IPagedResult } from 'app/core/models/general/result-model';
import { EchangeCommercialType } from './../../../../core/enums/echange-commercial-type.enum';
import { IEchangeCommercial } from './../../../agenda-commercial/agenda-commercial.model';
import { AppSettings } from 'app/app-settings/app-settings';
import { NavigationExtras, Router } from '@angular/router';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { RouteName } from 'app/core/enums/route-name.enum';

@Component({
    selector: 'kt-evenenment',
    templateUrl: './evenenment.component.html',
    encapsulation: ViewEncapsulation.None
})
export class EvenenmentComponent {

    @Output()
    changeEvent = new EventEmitter<{ page: number, pageSize: number }>();

    @Input()
    set data(data: IPagedResult<IEchangeCommercial>) {
        if (data != null) {
            this.echangeCommercialPaged = data;
        }
    }

    echangeCommercialPaged: IPagedResult<IEchangeCommercial>;
    status = EchangeCommercialStatus;
    type = EchangeCommercialType;
    pageSizeOptions = AppSettings.PAGE_SIZE_OPTIONS;

    /** navigationExtras */
    navigationExtras: NavigationExtras;

    constructor(
        private router: Router
    ) { }

    pageChange(event: any) {
        this.changeEvent.emit(
            {
                page: event.pageIndex + 1,
                pageSize: event.pageSize
            }
        );
    }

    /** display details of événement  */
    goToDocument(id: number) {
        this.navigationExtras = {
            queryParams: {
                mode: ModeEnum.Show,
                id,
                isMainRoute: true,
            }
        };
        this.router.navigate([`/${RouteName.AgendaCommercial}`], this.navigationExtras);
    }
}
