/**
 * Telugu Panchangam Astronomical Calculations
 * Ported and enhanced for Epic Toolbox
 */

export const CITIES = [
    { name: "Hyderabad", lat: 17.3850, lng: 78.4867, tz: 5.5 },
    { name: "Vijayawada", lat: 16.5062, lng: 80.6480, tz: 5.5 },
    { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, tz: 5.5 },
    { name: "Tirupati", lat: 13.6285, lng: 79.4192, tz: 5.5 },
    { name: "Bengaluru", lat: 12.9716, lng: 77.5946, tz: 5.5 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707, tz: 5.5 },
    { name: "New York", lat: 40.7128, lng: -74.0060, tz: -5 },
    { name: "London", lat: 51.5074, lng: -0.1278, tz: 0 },
    { name: "Dallas", lat: 32.7767, lng: -96.7970, tz: -6 },
    { name: "San Francisco", lat: 37.7749, lng: -122.4194, tz: -8 }
];

export const SAMVATSARAS = [
    "Prabhava", "Vibhava", "Shukla", "Pramadutha", "Prajothpatti", "Angeerasa", "Sreemukha", "Bhava", "Yuva", "Dhaatha",
    "Eswara", "Bahudhaanya", "Pramathi", "Vikrama", "Vrisha", "Chitrabhanu", "Swarabhanu", "Thaarana", "Paarthiva", "Vyaya",
    "Sarvajithu", "Sarvadhari", "Virodhi", "Vikruthi", "Khara", "Nandana", "Vijaya", "Jaya", "Manmadha", "Durmukhi",
    "Hevilambi", "Vilambi", "Vikaari", "Saarvari", "Plava", "Shubhakrutu", "Shobhakrutu", "Krodhi", "Viswavasu", "Paraabhava",
    "Plavanga", "Keelaka", "Sowmya", "Sadhaarana", "Virodhikrutu", "Pareidhavi", "Pramadheecha", "Aananda", "Rakshasa", "Nala",
    "Pingala", "Kaalayukthi", "Siddharthi", "Raudra", "Durmathi", "Dundubhi", "Rudhirodgaari", "Rakthaakshi", "Krodhana", "Akshaya"
];

export const TITHIS = [
    "Padyami", "Vidiya", "Tadiya", "Chavithi", "Panchami", "Shashti", "Saptami", "Ashtami",
    "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Pournami",
    "Padyami (Bahula)", "Vidiya (Bahula)", "Tadiya (Bahula)", "Chavithi (Bahula)", "Panchami (Bahula)",
    "Shashti (Bahula)", "Saptami (Bahula)", "Ashtami (Bahula)", "Navami (Bahula)", "Dashami (Bahula)",
    "Ekadashi (Bahula)", "Dwadashi (Bahula)", "Trayodashi (Bahula)", "Chaturdashi (Bahula)", "Amavasya"
];

export const NAKSHATRAS = [
    "Aswini", "Bharani", "Krittika", "Rohini", "Mrigasira", "Arudra", "Punarvasu", "Pushyami", "Aslesha",
    "Makha", "Pubba", "Uttara", "Hasta", "Chitra", "Swati", "Visakha", "Anuradha", "Jyeshta",
    "Moola", "Poorvashada", "Uttarashada", "Sravanam", "Dhanishta", "Satabhisham", "Poorvabhadra", "Uttarabhadra", "Revati"
];

export const RASIS = ["Mesham", "Vrushabham", "Midhunam", "Karkatakam", "Simham", "Kanya", "Thula", "Vrushchikam", "Dhanassu", "Makaram", "Kumbham", "Meenam"];

export const YOGAS = [
    "Vishkumbha", "Preeti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
];

export const KARANAS = [
    "Kimstughna", "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Shakuni", "Chatushpada", "Naga"
];

export const VARAS = ["Sunday (Aadivaaram)", "Monday (Somavaaram)", "Tuesday (Mangalavaaram)", "Wednesday (Budhavaaram)", "Thursday (Guruvaaram)", "Friday (Sukravaaram)", "Saturday (Shanivaaram)"];

const rev = (angle) => {
    return angle - Math.floor(angle / 360.0) * 360.0;
};

const getJulianDate = (date) => {
    return (date.getTime() / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5;
};

const getAyanamsa = (jd) => {
    const t = (jd - 2451545.0) / 36525;
    return 23.85 + 1.397 * t;
};

const getSunLongitude = (jd) => {
    const d = jd - 2451543.5;
    const w = 282.9404 + 4.70935e-5 * d;
    const e = 0.016709 - 1.151e-9 * d;
    const M = rev(356.0470 + 0.9856002585 * d);
    let E = M + (180/Math.PI) * e * Math.sin(M * Math.PI/180) * (1 + e * Math.cos(M * Math.PI/180));
    const x = Math.cos(E * Math.PI/180) - e;
    const y = Math.sin(E * Math.PI/180) * Math.sqrt(1 - e*e);
    const v = Math.atan2(y, x) * 180/Math.PI;
    return rev(v + w);
};

const getMoonLongitude = (jd) => {
    const d = jd - 2451543.5;
    const N = rev(125.1228 - 0.0529538083 * d);
    const i = 5.1454;
    const w = rev(318.0634 + 0.1643573223 * d);
    const a = 60.2666;
    const e = 0.054900;
    const M = rev(115.3654 + 13.0649929509 * d);

    let E = M + (180/Math.PI) * e * Math.sin(M * Math.PI/180) * (1 + e * Math.cos(M * Math.PI/180));
    for(let j=0; j<3; j++) {
        E = E - (E - (180/Math.PI) * e * Math.sin(E * Math.PI/180) - M) / (1 - e * Math.cos(E * Math.PI/180));
    }

    const x = a * (Math.cos(E * Math.PI/180) - e);
    const y = a * Math.sqrt(1 - e*e) * Math.sin(E * Math.PI/180);
    const v = Math.atan2(y, x) * 180/Math.PI;
    const xecl = Math.cos(N * Math.PI/180) * Math.cos((v+w) * Math.PI/180) - Math.sin(N * Math.PI/180) * Math.sin((v+w) * Math.PI/180) * Math.cos(i * Math.PI/180);
    const yecl = Math.sin(N * Math.PI/180) * Math.cos((v+w) * Math.PI/180) + Math.cos(N * Math.PI/180) * Math.sin((v+w) * Math.PI/180) * Math.cos(i * Math.PI/180);
    return rev(Math.atan2(yecl, xecl) * 180/Math.PI);
};

const getSunriseSunset = (date, lat, lng, tz) => {
    const d = getJulianDate(date) - 2451545.0 + 0.0008;
    const n = Math.round(d - 0.0009 - lng / 360);
    const Jtransit = 2451545.0 + 0.0009 + n + 0.0053 * Math.sin(rev(357.5291 + 0.98560028 * n) * Math.PI / 180) - 0.0069 * Math.sin(2 * rev(280.4665 + 0.98564736 * n) * Math.PI / 180);
    const M = rev(357.5291 + 0.98560028 * (Jtransit - 2451545.0));
    const L = rev(280.4665 + 0.98564736 * (Jtransit - 2451545.0) + 1.9142 * Math.sin(M * Math.PI / 180) + 0.02 * Math.sin(2 * M * Math.PI / 180) + 0.0003 * Math.sin(3 * M * Math.PI / 180));
    const decl = Math.asin(Math.sin(L * Math.PI / 180) * Math.sin(23.44 * Math.PI / 180)) * 180 / Math.PI;
    const cosH = (Math.sin(-0.83 * Math.PI / 180) - Math.sin(lat * Math.PI / 180) * Math.sin(decl * Math.PI / 180)) / (Math.cos(lat * Math.PI / 180) * Math.cos(decl * Math.PI / 180));

    if (cosH > 1 || cosH < -1) {
        return { sunrise: null, sunset: null };
    }

    const H = Math.acos(cosH) * 180 / Math.PI;
    const Jset = Jtransit + H / 360;
    const Jrise = Jtransit - H / 360;

    const sunriseDate = new Date((Jrise - 2440587.5) * 86400000 + (date.getTimezoneOffset() * 60000));
    const sunsetDate = new Date((Jset - 2440587.5) * 86400000 + (date.getTimezoneOffset() * 60000));

    const browserOffset = -date.getTimezoneOffset() / 60;
    const diff = tz - browserOffset;
    sunriseDate.setHours(sunriseDate.getHours() + diff);
    sunsetDate.setHours(sunsetDate.getHours() + diff);

    return { sunrise: sunriseDate, sunset: sunsetDate };
};

const formatTime = (date) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const getLuckyDetails = (rasiIdx) => {
    const lucky = [
        { color: "Red", number: "9, 1", gem: "Coral", direction: "East" }, // Mesham
        { color: "White", number: "6, 2", gem: "Diamond", direction: "South-East" }, // Vrushabham
        { color: "Green", number: "5, 3", gem: "Emerald", direction: "North" }, // Midhunam
        { color: "White", number: "2, 7", gem: "Pearl", direction: "North-West" }, // Karkatakam
        { color: "Gold", number: "1, 9", gem: "Ruby", direction: "East" }, // Simham
        { color: "Green", number: "5, 2", gem: "Emerald", direction: "North" }, // Kanya
        { color: "White/Blue", number: "6, 5", gem: "Diamond", direction: "West" }, // Thula
        { color: "Red", number: "9, 4", gem: "Coral", direction: "North" }, // Vrushchikam
        { color: "Yellow", number: "3, 1", gem: "Yellow Sapphire", direction: "North-East" }, // Dhanassu
        { color: "Black/Blue", number: "8, 6", gem: "Blue Sapphire", direction: "South" }, // Makaram
        { color: "Blue", number: "8, 5", gem: "Blue Sapphire", direction: "West" }, // Kumbham
        { color: "Yellow", number: "3, 9", gem: "Yellow Sapphire", direction: "North" } // Meenam
    ];
    return lucky[rasiIdx] || { color: "N/A", number: "N/A", gem: "N/A", direction: "N/A" };
};

export const calculatePanchangam = (dateStr, timeStr, lat, lng, tz) => {
    const dt = new Date(`${dateStr}T${timeStr}`);
    const jdLocal = getJulianDate(dt);
    const browserOffsetHours = -dt.getTimezoneOffset() / 60;
    const jdUT = jdLocal - (browserOffsetHours / 24.0);

    const sunLong = getSunLongitude(jdUT);
    const moonLong = getMoonLongitude(jdUT);
    const ayanamsa = getAyanamsa(jdUT);

    const nirayanaMoon = rev(moonLong - ayanamsa);
    const nirayanaSun = rev(sunLong - ayanamsa);

    // Tithi
    let diff = moonLong - sunLong;
    if (diff < 0) diff += 360;
    const tithiIdx = Math.floor(diff / 12);

    // Nakshatra
    const nakIdx = Math.floor(nirayanaMoon / (360/27));
    const pada = Math.floor((nirayanaMoon % (360/27)) / (360/108)) + 1;

    // Rasi
    const rasiIdx = Math.floor(nirayanaMoon / 30);

    // Yoga
    let yogaSum = moonLong + sunLong;
    const yogaIdx = Math.floor(rev(yogaSum - 2 * ayanamsa) / (360/27));

    // Karana
    const karanaIdx = Math.floor(diff / 6);

    // Vara
    const jdAdjusted = jdUT + (tz / 24.0);
    const dayIdx = (Math.floor(jdAdjusted + 0.5) + 1) % 7;

    // Samvatsara
    const year = dt.getFullYear();
    const samvatsaraIdx = (year - 1986 + 37 + 60) % 60;

    // Sunrise/Sunset
    const { sunrise, sunset } = getSunriseSunset(dt, lat, lng, tz);

    // Kalams
    let rahukalam = "--:--", yamagandam = "--:--", gulikalam = "--:--";
    if (sunrise && sunset) {
        const dayLength = sunset.getTime() - sunrise.getTime();
        const part = dayLength / 8;

        const getKalam = (parts) => {
            const start = new Date(sunrise.getTime() + parts[dayIdx] * part);
            const end = new Date(start.getTime() + part);
            return `${formatTime(start)} - ${formatTime(end)}`;
        };

        const rahuParts = [7, 1, 6, 4, 5, 3, 2];
        const yamaParts = [4, 3, 2, 1, 0, 6, 5];
        const guliParts = [6, 5, 4, 3, 2, 1, 0];

        rahukalam = getKalam(rahuParts);
        yamagandam = getKalam(yamaParts);
        gulikalam = getKalam(guliParts);
    }

    const lucky = getLuckyDetails(rasiIdx);

    return {
        samvatsara: SAMVATSARAS[samvatsaraIdx],
        tithi: TITHIS[tithiIdx] || "Unknown",
        nakshatra: NAKSHATRAS[nakIdx] || "Unknown",
        pada: pada,
        rasi: RASIS[rasiIdx] || "Unknown",
        yoga: YOGAS[yogaIdx] || "Unknown",
        karana: KARANAS[karanaIdx] || "Unknown",
        vara: VARAS[dayIdx],
        sunrise: formatTime(sunrise),
        sunset: formatTime(sunset),
        rahukalam: rahukalam,
        yamagandam: yamagandam,
        gulikalam: gulikalam,
        luckyColor: lucky.color,
        luckyNumber: lucky.number,
        luckyGem: lucky.gem,
        luckyDirection: lucky.direction
    };
};
