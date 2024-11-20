import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import calendar from "dayjs/plugin/calendar";

import 'dayjs/locale/en';
import 'dayjs/locale/de';
import 'dayjs/locale/ru';
import 'dayjs/locale/uk';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(calendar);

export const formatDate = (
    unixTimestamp: number,
    t: (key: string) => string,
    i18n: { language: string },
    userTimezone?: string
): string => {
    const date = dayjs.unix(unixTimestamp);
    const now = dayjs();

    dayjs.locale(i18n.language);

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
            sameDay: `[${t("Today at")}] HH:mm`,
            lastDay: `[${t("Yesterday at")}] HH:mm`,
            nextWeek: `dddd [${t("time_at")}] HH:mm`,
            lastWeek: `MMM D [${t("time_at")}] HH:mm`,
            sameElse: `MMM D [${t("time_at")}] HH:mm, YYYY`,
        },
    });

    if (nowInUserTimezone.diff(dateInUserTimezone, 'second') < 60) {
        return t('Just now');
    } else if (nowInUserTimezone.diff(dateInUserTimezone, 'hour') <= 20) {
        return date.fromNow();
    } else if (nowInUserTimezone.diff(dateInUserTimezone, 'day') < 7) {
        return dateInUserTimezone.calendar(null, {
            sameDay: `[${t("Today at")}] HH:mm`,
            lastDay: `[${t("Yesterday at")}] HH:mm`,
            nextWeek: `dddd [${t("time_at")}] HH:mm`,
            lastWeek: `MMM D [${t("time_at")}] HH:mm`,
            sameElse: `MMM D [${t("time_at")}] HH:mm, YYYY`,
        });
    } else {
        return dateInUserTimezone.format('MMM D, YYYY');
    }
};
