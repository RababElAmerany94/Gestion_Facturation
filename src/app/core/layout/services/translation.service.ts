// Angular
import { Injectable } from '@angular/core';
// Tranlsation
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class TranslationService {

    defaultLanguage = 'fr';

	/**
	 * Service Constructor
	 */
    constructor() { }

	/**
	 * Setup language
	 */
    setLanguage(translate: TranslateService, lang = this.defaultLanguage): Observable<any> {
        translate.setDefaultLang(lang);
        localStorage.setItem('language', lang);
        return translate.use(lang);
    }

	/**
	 * Returns selected language
	 */
    getSelectedLanguage(translate: TranslateService): any {
        return localStorage.getItem('language') || translate.getDefaultLang();
    }
    /** set tyranslation messages */
    setTranslatedMessages(translate: TranslateService, label: string): Promise<any> {
        return new Promise((resolve, reject) => {
            translate.get(label).subscribe(
                text => {
                    resolve(text);
                },
                err => {
                    reject(err)
                }
            )
        })
    }
}
