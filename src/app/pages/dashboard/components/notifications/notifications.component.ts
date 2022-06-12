import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { IPagedResult } from './../../../../core/models/general/result-model';
import { INotification } from './../../dashboard.model';

@Component({
    selector: 'kt-notifications',
    templateUrl: './notifications.component.html',
    encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent {

    @Output()
    changeEvent = new EventEmitter<{ page: number, pageSize: number }>();

    @Output()
    seenNotificationEvent = new EventEmitter<INotification>();

    @Output()
    markAllAsSeenNotification = new EventEmitter();

    @Input()
    set data(data: IPagedResult<INotification>) {
        if (data != null) {
            this.notificationsPaged = data;
        }
    }

    notificationsPaged: IPagedResult<INotification>;
    pageSizeOptions = AppSettings.PAGE_SIZE_OPTIONS;

    constructor() { }

    seenNotifications(index: number) {
        const notification = this.notificationsPaged.value[index];
        if (!notification.isSeen) {
            this.seenNotificationEvent.emit(notification);
        }
    }

    pageChange(event: any) {
        this.changeEvent.emit(
            {
                page: event.pageIndex + 1,
                pageSize: event.pageSize
            }
        );
    }

}
