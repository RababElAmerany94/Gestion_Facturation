// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// RxJS
import { Subject } from 'rxjs';
// Object-Path
import * as objectPath from 'object-path';

@Injectable({
    providedIn: 'root',
})
export class PageConfigService {
    // Public properties
    onConfigUpdated$: Subject<any>;
    pageConfig: any;

    /**
     * Service Constructor
     *
     * @param router: Router
     */
    constructor(private router: Router) {
        // register on config changed event and set default config
        this.onConfigUpdated$ = new Subject();
    }

    /**
     * Get current page config based on route
     */
    getCurrentPageConfig(path?: string): any {
        let configPath = this.cleanUrl(this.router.url);

        if (path) {
            configPath += '.' + path;
        }

        // get page config by path
        return objectPath.get(this.pageConfig, configPath);
    }

    /**
     * Load confgis
     *
     * @param config: any
     */
    loadConfigs(config: any) {
        this.pageConfig = config;
        this.onConfigUpdated$.next(this.pageConfig);
    }

    /**
     * Remove unnecessary params from URL
     * @param url
     */
    cleanUrl(url: string): string {
        // remove first route (demo name) from url router
        if (new RegExp(/^\/demo/).test(url)) {
            const urls = url.split('/');
            urls.splice(0, 2);
            url = urls.join('/');
        }

        if (url.charAt(0) == '/') {
            url = url.substr(1);
        }

        // we get the page title from config, using url path.
        // we need to remove query from url ?id=1 before we use the path to search in array config.
        let finalUrl = url.replace(/\//g, '.');
        if (finalUrl.indexOf('?') !== -1) {
            finalUrl = finalUrl.substring(0, finalUrl.indexOf('?'));
        }

        return finalUrl;
    }
}
