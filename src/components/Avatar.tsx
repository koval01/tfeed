import { getInitials, stringToHash } from "@/helpers/string";
import { Avatar as AvatarVK } from "@vkontakte/vkui";

export const Avatar = ({ size = 48, src, name }: { size?: number, src?: string, name?: string }) => {
    const color = Math.abs(stringToHash(name || "Nothing") % 6) + 1 as 1 | 2 | 3 | 4 | 5 | 6;
    return <AvatarVK size={size} src={src} initials={getInitials(name)} gradientColor={color} />
}
