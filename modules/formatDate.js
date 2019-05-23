module.exports = {
    run: date => {
        if (!(date instanceof Date)) date = new Date(date);
        return (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + " " + (date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()) + ":" + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    }
};