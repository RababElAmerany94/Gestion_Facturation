// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
import { IMenuConfig } from '../_config/menu.config';


@Injectable({
    providedIn: 'root',
})
export class MenuConfigService {

    // public properties
    onConfigUpdated$: BehaviorSubject<IMenuConfig>;

    // private properties
    private menuConfig: IMenuConfig;

    /**
     * Service Constructor
     */
    constructor() {
        // register on config changed event and set default config
        this.onConfigUpdated$ = new BehaviorSubject<IMenuConfig>(null);
    }

    /**
     * Returns the menuConfig
     */
    getMenus() {
        return this.menuConfig;
    }

    /**
     * Load config
     *
     * @param config: any
     */
    loadConfigs(config: IMenuConfig) {
        this.menuConfig = config;
        this.onConfigUpdated$.next(this.menuConfig);
    }
}
