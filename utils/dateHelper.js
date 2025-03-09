const moment = require("moment-timezone");

/**
 * Egy időbélyeg alapján dinamikusan formázott dátumot ad vissza.
 * @param {string} timestamp - Az UTC időbélyeg string formátumban.
 * @returns {string} - A formázott dátum.
 */
exports.dynamicsDateTime = (timestamp) => {
    const date = moment(timestamp).tz("Europe/Budapest"); // Magyar időzónába konvertálás
    const now = moment.tz("Europe/Budapest"); // Aktuális magyar idő
    const diffDays = now.diff(date, "days"); // Napok különbsége

    if (now.isSame(date, "day")) {
        // Ha ma van
        return date.format("HH:mm");
    } else if (diffDays < 7) {
        // Ha egy héten belül
        return date.format("dddd"); // Nap neve magyarul
    } else if (now.isSame(date, "year")) {
        // Ha egy éven belül
        return date.format("MMM D."); // Rövid hónap és nap
    } else {
        // Ha több mint egy év eltelt
        return date.format("YYYY. MM. DD."); // Teljes dátum
    }
};



/**
 * Egy adott dátum napját adja vissza.
 * @param {string} dateString - A dátum string formátumban.
 * @returns {number} - A hónap napja (1-től 31-ig).
 */
exports.getDay = (dateString) => {
    const date = new Date(dateString);
    return date.getDate(); // Visszaadja a nap számát.
};

/**
 * Egy adott dátum hónapját adja vissza szöveges formában.
 * @param {string} dateString - A dátum string formátumban.
 * @returns {string} - A hónap szöveges rövidítése (pl. "jan", "feb").
 */
exports.getMonthAsText = (dateString) => {
    const date = new Date(dateString);

    // Hónap rövidítések
    const monthNames = [
        'jan', 'feb', 'márc', 'ápr', 'máj', 'jún', 
        'júl', 'aug', 'szept', 'okt', 'nov', 'dec'
    ];

    return monthNames[date.getMonth()]; // Visszaadja a hónapot szöveges formában.
};

/**
 * Két dátum közötti időtartományt ad vissza óra:perc formátumban.
 * @param {string} startDateString - A kezdődátum UTC formátumban.
 * @param {string} endDateString - A záródátum UTC formátumban.
 * @returns {string} - Az időintervallum (pl. "18:00-19:30").
 */
exports.getFormatTime = (startDateString, endDateString) => {
    
    const startDate = moment(startDateString).tz("Europe/Budapest"); // Kezdő dátum konvertálása magyar időzónába
    const endDate = moment(endDateString).tz("Europe/Budapest"); // Záró dátum konvertálása magyar időzónába
    const startTime = startDate.format("HH:mm"); // Kezdő idő formázása
    const endTime = endDate.format("HH:mm"); // Záró idő formázása
    
    return `${startTime}-${endTime}`; // Időtartomány visszaadása
};

