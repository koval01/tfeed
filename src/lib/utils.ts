import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getCorrectCount = (num: number): number => {
    const lastTwo = num % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return 5;

    const lastDigit = num % 10;
    return lastDigit === 0 ? 5 : lastDigit;
};

export const parseAbbreviatedNumber = (str: string, key = true): number | string => {
    const multipliers = {
        K: 1e3,
        M: 1e6,
        B: 1e9,
        T: 1e12
    } as const;

    const match = str.match(/^([\d.]+)([KMBT]?)$/);

    if (!match) {
        throw new Error("Invalid format");
    }

    const number = parseFloat(match[1]);
    const suffix = match[2] as keyof typeof multipliers;

    const result = Math.round(number * (suffix ? multipliers[suffix] : 1));
    return key ? getPluralKey(result) : result;
}

const getPluralKey = (num: number): string => {
    const lastTwo = num % 100;
    const lastDigit = num % 10;

    if (lastTwo >= 11 && lastTwo <= 14) return 'many';
    if (lastDigit === 1) return 'one';
    if (lastDigit >= 2 && lastDigit <= 4) return 'few';
    return 'many'; 
}

export const randomString = () => Math.random().toString(36).slice(2);
