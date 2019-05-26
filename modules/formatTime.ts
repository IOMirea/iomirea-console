export default function (date: Date|number) {
    if (!(date instanceof Date)) date = new Date(date);
    const h = date.getHours();
    const m = date.getMinutes();
    return (h < 10 ? ('0' + h) : h) + ":" + (m < 10 ? ('0' + m) : m);
}