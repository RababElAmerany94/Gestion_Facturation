import { ElementRef, Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
    providedIn: 'root',
})
export class SplashScreenService {

    // Private properties
    private el: ElementRef;
    private stopped: boolean;
    private started: boolean;

    /**
     * service constructor
     * @param ngxService: NgxUiLoaderService
     */
    constructor(
        private loaderService: NgxUiLoaderService) { }

    /**
     * init
     * @param element: ElementRef
     */
    init(element: ElementRef) {
        this.el = element;
    }

    /**
     * show
     */
    show() {
        if (this.started) {
            return;
        }

        this.started = true;
        this.stopped = false;
        this.el.nativeElement.style.display = 'flex';
        document.body.classList.remove('kt-page--loaded');
        this.loaderService.start();
    }

    /**
     * hide
     */
    hide() {
        if (this.stopped) {
            return;
        }

        this.started = false;
        this.stopped = true;
        this.el.nativeElement.style.display = 'none';
        document.body.classList.add('kt-page--loaded');
        this.loaderService.stop();
    }


}
