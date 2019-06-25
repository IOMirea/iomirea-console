/**
 * Formats time (hh:mm)
 *
 * @param {Date|number} date The date object/timestamp that should be formatted
 * @returns {string} The formatted string
 */
export default function (date: Date|number): string {
    if (!(date instanceof Date)) date = new Date(date);
    const h = date.getHours();
    const m = date.getMinutes();
    return (h < 10 ? ('0' + h) : h) + ":" + (m < 10 ? ('0' + m) : m);
}