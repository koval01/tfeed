import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(calendar);

const formatDate = (unixTimestamp: number, userTimezone?: string) => {
    const date = dayjs.unix(unixTimestamp);
    const now = dayjs();

    let nowInUserTimezone = now;
    let dateInUserTimezone = date;

    if (userTimezone) {
        try {
            nowInUserTimezone = now.tz(userTimezone);
            dateInUserTimezone = date.tz(userTimezone);
        } catch (error) {
            console.warn("Invalid timezone provided. Using system timezone.", error);
        }
    }

    // Always use 24-hour format
    dayjs.updateLocale("en", {
        calendar: {
            sameDay: "[Today at] HH:mm",
            lastDay: "[Yesterday at] HH:mm",
            nextWeek: "dddd [at] HH:mm",
            lastWeek: "MMM D [at] HH:mm",
            sameElse: "MMM D [at] HH:mm, YYYY",
        },
    });

    if (nowInUserTimezone.diff(dateInUserTimezone, 'second') < 60) {
        return 'Just now';
    } else if (nowInUserTimezone.diff(dateInUserTimezone, 'minute') < 60) {
        return `${nowInUserTimezone.diff(dateInUserTimezone, 'minute')} minute${nowInUserTimezone.diff(dateInUserTimezone, 'minute') > 1 ? 's' : ''} ago`;
    } else if (nowInUserTimezone.diff(dateInUserTimezone, 'hour') < 24) {
        return `${nowInUserTimezone.diff(dateInUserTimezone, 'hour')} hour${nowInUserTimezone.diff(dateInUserTimezone, 'hour') > 1 ? 's' : ''} ago`;
    } else if (nowInUserTimezone.diff(dateInUserTimezone, 'day') < 7) {
        return dateInUserTimezone.calendar(null, {
            sameDay: '[Today at] HH:mm',
            lastDay: '[Yesterday at] HH:mm',
            nextWeek: 'dddd [at] HH:mm',
            lastWeek: 'MMM D [at] HH:mm',
            sameElse: 'MMM D [at] HH:mm, YYYY'
        });
    } else {
        return dateInUserTimezone.format('MMM D, YYYY');
    }
};

export default formatDate;
