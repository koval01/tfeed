import { ProfileNear } from '@/types';

import { Avatar, Group, Header, SimpleCell, Skeleton } from "@vkontakte/vkui";

import { Link } from "@/components/Link";

import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

interface NearbyProps {
    profiles: ProfileNear[] | undefined;
}

interface HeaderCompoment extends NearbyProps {
    t: TFunction<"translation", undefined>
}
interface CellComponentProps extends HeaderCompoment { }

interface AvatarProps {
    profile: ProfileNear
}

const HeaderCompoment = ({ profiles, t }: HeaderCompoment) => (
    <Header mode="secondary">
        {!profiles ? <Skeleton width={120} /> : t("People are nearby")}
    </Header>
);

const SkeletonComponent = () => (
    [...Array(5)].map((_, i) => (
        <SimpleCell
            key={i}
            before={<Skeleton width={48} height={48} borderRadius="50%" />}
            subtitle={<Skeleton width={75} />}
        >
            <Skeleton width={100} />
        </SimpleCell>
    ))
);

const AvatarComponent = ({ profile }: AvatarProps) => (
    profile?.avatar ?
        <Avatar size={48} src={profile?.avatar} /> :
        <Avatar size={48} src="#" initials={profile.displayName.slice(0, 1)} />
);

const CellComponent = ({ profiles, t }: CellComponentProps) => (
    profiles?.map((profile, index) => (
        <Link
            key={index}
            href={`/profile/${profile.id}`}
        >
            <SimpleCell
                before={<AvatarComponent profile={profile} />}
                subtitle={[profile.city, profile.country].join(", ")}
            >
                {profile?.displayName}
            </SimpleCell>
        </Link>
    ))
);

const Nearby = ({ profiles }: NearbyProps) => {
    const { t } = useTranslation();

    return (
        <Group
            header={<HeaderCompoment profiles={profiles} t={t} />}
        >
            {!profiles ?
                <SkeletonComponent /> :
                <CellComponent profiles={profiles} t={t} />
            }
        </Group>
    )
}

export default Nearby;
