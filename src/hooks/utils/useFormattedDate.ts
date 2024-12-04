import { formatDate } from "@/helpers/date";
import { useTranslation } from "react-i18next";

export const useFormattedDate = (unixTimestamp: number, userTimezone?: string): string => {
    const { t, i18n } = useTranslation();

    return formatDate(unixTimestamp, t, i18n, userTimezone);
}
