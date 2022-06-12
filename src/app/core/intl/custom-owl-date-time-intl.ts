import { TranslateService } from '@ngx-translate/core';
import { OwlDateTimeIntl } from 'ng-pick-datetime';

export class CustomOwlDateTimeIntl extends OwlDateTimeIntl {

    private translate: TranslateService;

    /** A label for the up second button (used by screen readers).  */
    upSecondLabel = 'Add a second';

    /** A label for the down second button (used by screen readers).  */
    downSecondLabel = 'Minus a second';

    /** A label for the up minute button (used by screen readers).  */
    upMinuteLabel = 'Add a minute';

    /** A label for the down minute button (used by screen readers).  */
    downMinuteLabel = 'Minus a minute';

    /** A label for the up hour button (used by screen readers).  */
    upHourLabel = 'Add a hour';

    /** A label for the down hour button (used by screen readers).  */
    downHourLabel = 'Minus a hour';

    /** A label for the previous month button (used by screen readers). */
    prevMonthLabel = 'Previous month';

    /** A label for the next month button (used by screen readers). */
    nextMonthLabel = 'Next month';

    /** A label for the previous year button (used by screen readers). */
    prevYearLabel = 'Previous year';

    /** A label for the next year button (used by screen readers). */
    nextYearLabel = 'Next year';

    /** A label for the previous multi-year button (used by screen readers). */
    prevMultiYearLabel = 'Previous 21 years';

    /** A label for the next multi-year button (used by screen readers). */
    nextMultiYearLabel = 'Next 21 years';

    /** A label for the 'switch to month view' button (used by screen readers). */
    switchToMonthViewLabel = 'Change to month view';

    /** A label for the 'switch to year view' button (used by screen readers). */
    switchToMultiYearViewLabel = 'Choose month and year';

    /** A label for the cancel button */
    cancelBtnLabel = 'CANCEL';

    /** A label for the set button */
    setBtnLabel = 'Set';

    /** A label for the range 'from' in picker info */
    rangeFromLabel = 'From';

    /** A label for the range 'to' in picker info */
    rangeToLabel = 'To';

    /** A label for the hour12 button (AM) */
    hour12AMLabel = 'AM';

    /** A label for the hour12 button (PM) */
    hour12PMLabel = 'PM';

    injectTranslateService(translate: TranslateService) {
        this.translate = translate;
        this.translate.onLangChange.subscribe(() => {
            this.translateLabels();
        });
        this.translateLabels();
    }

    translateLabels() {
        this.upSecondLabel = this.translate.instant('OWL-DATETIME.ADD-SECOND');
        this.downSecondLabel = this.translate.instant('OWL-DATETIME.MINUS-SECOND');
        this.upMinuteLabel = this.translate.instant('OWL-DATETIME.ADD-MINUTE');
        this.downMinuteLabel = this.translate.instant('OWL-DATETIME.MINUS-MINUTE');
        this.upHourLabel = this.translate.instant('OWL-DATETIME.ADD-HOUR');
        this.downHourLabel = this.translate.instant('OWL-DATETIME.MINUS-HOUR');
        this.prevMonthLabel = this.translate.instant('OWL-DATETIME.PREVIOUS-MONTH');
        this.nextMonthLabel = this.translate.instant('OWL-DATETIME.NEXT-MONTH');
        this.prevYearLabel = this.translate.instant('OWL-DATETIME.PREVIOUS-YEAR');
        this.nextYearLabel = this.translate.instant('OWL-DATETIME.NEXT-YEAR');
        this.prevMultiYearLabel = this.translate.instant('OWL-DATETIME.PREVIOUS-21-YEARS');
        this.nextMultiYearLabel = this.translate.instant('OWL-DATETIME.NEXT-21-YEARS');
        this.switchToMonthViewLabel = this.translate.instant('OWL-DATETIME.CHANGE-TO-MONTH-VIEW');
        this.switchToMultiYearViewLabel = this.translate.instant('OWL-DATETIME.CHOOSE-MONTH-AND-YEAR');
        this.cancelBtnLabel = this.translate.instant('OWL-DATETIME.CANCEL');
        this.setBtnLabel = this.translate.instant('OWL-DATETIME.SET');
        this.rangeFromLabel = this.translate.instant('OWL-DATETIME.FROM');
        this.rangeToLabel = this.translate.instant('OWL-DATETIME.TO');
        this.hour12AMLabel = this.translate.instant('OWL-DATETIME.AM');
        this.hour12PMLabel = this.translate.instant('OWL-DATETIME.PM');
    }

}
