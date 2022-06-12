import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ILoaderPercent } from 'app/core/models/general/loader-percent';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    private isLoading = new Subject<ILoaderPercent>();

    loaderState = this.isLoading.asObservable();

    show(message: string = null) {
        this.isLoading.next({ show: true, message });
    }

    hide() {
        this.isLoading.next({ show: false });
    }

}
