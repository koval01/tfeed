import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const formatDate = (unixTimestamp: number) => {
    const date = dayjs.unix(unixTimestamp);
    const now = dayjs();
    return now.diff(date, 'hour') < 24 ? date.fromNow() : date.format('MMMM D, HH:MM');
};

export default formatDate;
