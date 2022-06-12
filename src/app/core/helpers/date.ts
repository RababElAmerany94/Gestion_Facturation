import { StringHelper } from 'app/core/helpers/string';
import { intervalToDuration } from 'date-fns';
/**
 * a class describe date helpers
 */
export class DateHelper {

    static initTime = '00:00:00'

    /**
     * FORMAT DATE TIME
     */
    static formatDateTime(date: string) {
        const convertDate = new Date(date);
        const year = convertDate.getFullYear();
        const month = (convertDate.getMonth() + 1).toString().padStart(2, '0');
        const day = convertDate.getDate().toString().padStart(2, '0');
        const hour = convertDate.getHours().toString().padStart(2, '0');
        const minutes = convertDate.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minutes}`;
    }

    /**
     * FORMAT DATE
     * @param date Date
     */
    static formatDate(date: string) {
        const convertDate = new Date(date);
        const year = convertDate.getFullYear();
        const month = (convertDate.getMonth() + 1).toString().padStart(2, '0');
        const day = convertDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}T00:00`;
    }

    /**
     * FORMAT TIME
     */
    static formatTime(date: string) {
        const convertDate = new Date(date);
        const hour = convertDate.getHours().toString().padStart(2, '0');
        const minutes = convertDate.getMinutes().toString().padStart(2, '0');
        return `${hour}:${minutes}`;
    }

    /**
     * is valid date
     */
    static isValidDate(date: string) {
        const unixTimeZero = Date.parse(date);
        return !isNaN(unixTimeZero);
    }

    /**
     * combine between date and time
     * @param date the date
     * @param time the time
     */
    static combineDateWithTime(date: string, time: string) {
        const convertDate = new Date(date);
        const year = convertDate.getFullYear()
        const month = (convertDate.getMonth() + 1).toString().padStart(2, '0');
        const day = convertDate.getDate().toString().padStart(2, '0');
        if (!StringHelper.isEmptyOrNull(time) && !time.includes(this.initTime)) {
            return `${year}-${month}-${day}T${time}`;
        } else {
            return `${year}-${month}-${day}`
        }
    }

    /**
     * add time to date
     * @param date the date
     * @param time the time you want to add
     */
    static addTimeToDate(date: string, time: string) {
        const convertDate = new Date(date);
        if (!StringHelper.isEmptyOrNull(time) && !time.includes(this.initTime)) {
            const convertTime = new Date(`2019-01-01T${time}`)
            convertDate.setHours(convertDate.getHours() + convertTime.getHours())
            convertDate.setMinutes(convertDate.getMinutes() + convertTime.getMinutes())
            return this.formatDateTime(convertDate.toString());
        } else {
            return date
        }
    }

    static getDurationFromInterval(dates: { start: Date, end: Date }) {
        const interval = intervalToDuration(dates);
        const hours = interval.days * 24 + interval.hours;
        return `${hours}:${interval.minutes}`;
    }

    static getFirstDayInTheCurrentYear() {
        const date = new Date();
        return `${date.getFullYear()}-01-01T00:00`;
    }

    static getLastDayInTheCurrentYear() {
        const date = new Date();
        return `${date.getFullYear()}-12-31T00:00`;
    }

    /**
     * the year of date
     */
    static getYear(date: string) {
        const convertDate = new Date(date);
        const year = convertDate.getFullYear();
        return `${year}`;
    }

    /**
     * the month of date
     */
    static getMonth(date: string) {
        const convertDate = new Date(date);
        let month = (convertDate.getMonth() + 1).toString().padStart(2, '0');
        if (month.indexOf('0') === 0) {
            month = month.substr(1);
        }
        return `${month}`;
    }

    /**
     * the day of date
     */
    static getDay(date: string) {
        const convertDate = new Date(date);
        const day = convertDate.getDate().toString().padStart(2, '0');
        return `${day}`;
    }

    /**
     * the date format
     */
    static getDates(date: string) {
        const convertDate = new Date(date);
        const year = convertDate.getFullYear();
        const month = (convertDate.getMonth() + 1).toString().padStart(2, '0');
        const day = convertDate.getDate().toString().padStart(2, '0');
        const hour = convertDate.getHours().toString().padStart(2, '0');
        const minutes = convertDate.getMinutes().toString().padStart(2, '0');
        return `${year}/${month}/${day} - ${hour}:${minutes}`;
    }

}
