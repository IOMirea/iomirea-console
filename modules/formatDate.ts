/**
 * Formats a date (e.g. January 15. 2019)
 *
 * @param {Date|number} date The date object/timestamp that should be formatted
 * @returns {string} The formatted string
 */
export default function(date: Date|number): string {
    if (!(date instanceof Date)) date = new Date(date);
    let month = this.language.texts["MONTH_" + (date.getMonth() + 1)].t;
    return month + " " + date.getDate() + ", " + date.getFullYear();
}