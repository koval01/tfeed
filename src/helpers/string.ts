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

export const getInitials = (name: string | undefined): string => {
    if (!name) return "NN";
    const words = name.split(" ");
    const initials = words.map(word => word[0].toUpperCase()).join("");
    return initials;
}
