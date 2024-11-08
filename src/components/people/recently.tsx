import { ProfileNear } from "@/types";

import { Avatar, Group, Header, HorizontalCell, HorizontalScroll, Skeleton } from "@vkontakte/vkui";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface RecentlyProps {
    profiles: ProfileNear[] | undefined
}

const HeaderCompoment = ({ profiles }: RecentlyProps) => {
    const { t } = useTranslation();

    return (
        <Header mode="secondary">{!profiles ? <Skeleton width={120} /> : t("Recently joined")}</Header>
    )
}

const SkeletonComponent = () => (
    [...Array(5)].map((_, i) => (
        <HorizontalCell key={i} header={
            // @ts-ignore
            <Skeleton width={48} />
        }>
            {/* @ts-ignore */}
            <Skeleton width={56} height={56} borderRadius="50%" />
        </HorizontalCell>
    ))
);

const ProfileAvatar = ({ profile }: { profile: ProfileNear }) => (
    profile?.avatar ?
        <Avatar size={56} src={profile?.avatar} /> :
        <Avatar size={56} src="#" initials={profile.displayName.slice(0, 1)} />
);

const ProfileComponent = ({ profiles }: RecentlyProps) => {
    const router = useRouter();

    return (
        profiles?.map((profile, index) => (
            <HorizontalCell onClick={() => router.push(`/profile/${profile.id}`)} key={index} header={profile.displayName}>
                <ProfileAvatar profile={profile} />
            </HorizontalCell>
        ))
    )
}

const Recently = ({ profiles }: RecentlyProps) => (
    <Group header={<HeaderCompoment profiles={profiles} />}>
        <HorizontalScroll
            showArrows
            getScrollToLeft={(i) => i - 120}
            getScrollToRight={(i) => i + 120}
            inline
        >
            {!profiles ?
                <SkeletonComponent /> :
                <ProfileComponent profiles={profiles} />
            }
        </HorizontalScroll>
    </Group>
)

export default Recently;
