import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { DossierStatus } from 'app/core/enums/dossier-status.enums';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IDossier } from 'app/pages/dossier/dossier.model';

@Component({
    selector: 'kt-evenement-dossier',
    templateUrl: './evenement-dossier.component.html',
    styleUrls: ['evenement-dossier.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EvenementDossierComponent {

    @Output()
    changeEvent = new EventEmitter<{ page: number, pageSize: number }>();

    @Input()
    set data(data: IPagedResult<IDossier>) {
        if (data != null) {
            this.dossier = data;
            this.dossiers = data.value.sort((val1, val2) => {
                return new Date(val2.createdOn).getTime() - new Date(val1.createdOn).getTime()
            });
        }
    }

    dossier: IPagedResult<IDossier>;
    dossiers: IDossier[] = [];
    status = DossierStatus;
    pageSizeOptions = AppSettings.PAGE_SIZE_OPTIONS;

    constructor() { }

    pageChange(event: any) {
        this.changeEvent.emit(
            {
                page: event.pageIndex + 1,
                pageSize: event.pageSize
            }
        );
    }

}
