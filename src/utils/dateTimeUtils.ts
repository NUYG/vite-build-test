const newDate: Date = new Date();
const yearNow: number = newDate.getFullYear();
export const getMonthNumberFromName = (monthName: string) => {
    return new Date(`${monthName} 1, ${yearNow}`).getMonth() + 1;
};
export const addZeroToDateTime = (dateTime: number) => {
    return dateTime < 10 ? "0" + dateTime : dateTime.toString();
};
export const fixDateTime = (dateTime: string | Date) => {
    const newDateTime = new Date(dateTime);
    const date = addZeroToDateTime(newDateTime.getDate());
    const year = newDateTime.getFullYear();
    const hours = addZeroToDateTime(newDateTime.getHours());
    const minute = addZeroToDateTime(newDateTime.getMinutes());
    const convertMonth = newDateTime.toLocaleString("en-us", {
        month: "long",
    });
    const month = addZeroToDateTime(
        newDateTime.getMonth() !== 0
            ? newDateTime.getMonth() + 1
            : getMonthNumberFromName(convertMonth)
    );
    const configDdMmYy = date + "/" + month + "/" + year;
    const time = (newDateTime.getMinutes() || newDateTime.getHours()) ? ", " + hours + ":" + minute : "";
    return dateTime !== null ? configDdMmYy + time : "";
};


export const ddMmYyyy = (dateTime: string | Date) => {
    const newDateTime = new Date(dateTime);
    const date = addZeroToDateTime(newDateTime.getDate());
    const year = newDateTime.getFullYear();
    const convertMonth = newDateTime.toLocaleString("en-us", {
        month: "long",
    });
    const month = addZeroToDateTime(
        newDateTime.getMonth() !== 0
            ? newDateTime.getMonth() + 1
            : getMonthNumberFromName(convertMonth)
    );
    const configDdMmYy = date + "/" + month + "/" + year;
    return dateTime !== null ? configDdMmYy : "";
};


export const ddMm = (dateTime: string | Date) => {
    const newDateTime = new Date(dateTime);
    const date = addZeroToDateTime(newDateTime.getDate());
    const convertMonth = newDateTime.toLocaleString("en-us", {
        month: "long",
    });
    const month = addZeroToDateTime(
        newDateTime.getMonth() !== 0
            ? newDateTime.getMonth() + 1
            : getMonthNumberFromName(convertMonth)
    );
    const configDdMm = date + "/" + month;
    return dateTime !== null ? configDdMm : "";
};


export const getTime = (dateTime: string | Date) => {
    const newDateTime = new Date(dateTime);
    const hours = newDateTime.getHours();
    const min = newDateTime.getMinutes()
    const decHours = addZeroToDateTime(hours);
    const decMinute = addZeroToDateTime(min);
    const time = (hours || min) ? decHours + ":" + decMinute : "";
    return dateTime !== null ? time : "";
};


export const getFullDateTime = (dateTime: string | Date) => {
    return getTime(dateTime) + ' ' + ddMm(dateTime);
}


export const defaultDayInput = (dayAhead: number) => {
    const d = new Date();
    d.setDate(new Date().getDate() + dayAhead);
    return ymdFormattedDay(d);
};


export const defaultTomorrowInput = () => {
    const tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    return ymdFormattedDay(tomorrow);
};

export const defaultToDayInput = () => {
    return ymdFormattedDay(newDate);
};

const ymdFormattedDay = (dateObj: Date) => {
    const month = addZeroToDateTime(
        dateObj.getMonth() < 12 ? dateObj.getMonth() + 1 : 1
    );
    const date = addZeroToDateTime(dateObj.getDate());

    return `${yearNow}-${month}-${date}`;
};

export const defaultFromDateInput = () => {
    const month = addZeroToDateTime(
        newDate.getMonth() < 12 ? newDate.getMonth() + 1 : 1
    );
    const date = newDate.getDate();
    const subMonth = month !== "01" ? addZeroToDateTime(parseInt(month) - 1) : "12";
    const subYear = month === "01" ? yearNow - 1 : yearNow;
    return date > 4 ? `${yearNow}-${month}-05` : `${subYear}-${subMonth}-05`;
};

export const getDdMm = (dateTime: string | Date) => {
    const date = new Date(dateTime).getDate();
    const month = new Date(dateTime).getMonth() + 1;
    return `${addZeroToDateTime(date)}/${addZeroToDateTime(month)}`;
};

export const sameDay = (date1: Date | string, date2: Date | string) => {
    const d1 = new Date(date1)
    const d2: Date = new Date(date2)
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
}

export const minutesApart = (date1: Date | string, date2: Date | string, minute: number) => {
    const d1: Date = new Date(date1)
    const d2: Date = new Date(date2)
    const minuteDiff = Math.abs(d1.getTime() - d2.getTime());

    return minuteDiff >= (minute * 60 * 1000)
}


export const hoursApart = (date1: Date | string, date2: Date | string, hour: number) => {
    const d1: Date = new Date(date1)
    const d2: Date = new Date(date2)
    const hourDiff = Math.abs(d1.getTime() - d2.getTime());
    return hourDiff >= (hour * 3600 * 1000)
}


export const VNDateFormat = (dateTime: Date, dayInclude: boolean = false, oneWeek: boolean = false) => {
    const today: Date = new Date();
    const nDatetime: Date = new Date(dateTime);
    if (nDatetime.getDate() === today.getDate()) {
        return "Hôm nay";
    } else if (nDatetime.getDate() === today.getDate() + 1) {
        return "Ngày mai";
    } else if (nDatetime.getDate() && (!oneWeek || (
       (nDatetime.getDate() <= today.getDate() + 6) && (nDatetime.getDate() >= today.getDate())
    ))) {
        return VNWeekDays(dateTime) + (dayInclude ? (' - ' + ddMm(dateTime)) : '');
    } else if (nDatetime.getDate()) {
        return ddMm(dateTime);
    } else return "";
};


export const VNWeekDays = (dateTime: Date) => {
    const date = new Date(dateTime);
    const dayOfWeek = date.getDay();
    const daysOfWeek = [
        "Chủ Nhật",
        "Thứ Hai",
        "Thứ Ba",
        "Thứ Tư",
        "Thứ Năm",
        "Thứ Sáu",
        "Thứ Bảy",
    ];
    if (dayOfWeek >= 0 && dayOfWeek <= 6) {
        return daysOfWeek[dayOfWeek];
    } else {
        return "Không phải ngày trong tuần";
    }
};

import moment from 'moment';

export const calculateWeeks = (fromDate: string): number | '' => {
    const start = moment(fromDate);
    const end = moment();

    if (start.isBefore(end)) {
        return '';
    }
    return start.diff(end, 'weeks');
}