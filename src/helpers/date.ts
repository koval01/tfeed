import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { i18n } from "i18next";

import 'dayjs/locale/en';
import 'dayjs/locale/ru';
import 'dayjs/locale/uk';

dayjs.extend(relativeTime);

const formatDate = (unixTimestamp: number, i18n: i18n) => {
    dayjs.locale(i18n.language);
    const date = dayjs.unix(unixTimestamp);
    const now = dayjs();
    return now.diff(date, 'hour') < 24 ? date.fromNow() : date.format('MMMM D, HH:MM');
};

export default formatDate;
