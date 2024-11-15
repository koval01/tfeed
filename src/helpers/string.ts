export const stringToHash = (str: string): number => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return hash;
}

export const removeEmojies = (str: string): string => {
    return str.replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''
    ).trim();
} 

export const getInitials = (name: string | undefined): string => {
    if (!name) return "NN";
    name = removeEmojies(name);
    const words = name.split(" ");
    const initials = words.map(word => word[0]?.toUpperCase()).join("");
    return initials.slice(0, 2);
}
