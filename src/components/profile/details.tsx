import { ProfileDetails } from '@/types';

import { Icon28EditOutline, Icon28MagicHatOutline, Icon28PlaceOutline } from '@vkontakte/icons';
import { ContentBadge, Group, SimpleCell, Skeleton } from '@vkontakte/vkui';

import i18next, { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

interface LocationProps {
    profile: ProfileDetails | undefined
    t: TFunction<"translation", undefined>
}

interface PersonalityProps extends LocationProps { };

interface InterestsProps {
    interests: string[] | undefined
    t: TFunction<"translation", undefined>
}

interface DetailsProps {
    profile: ProfileDetails | undefined
    interests: string[] | undefined
}

const Location = ({ profile, t }: LocationProps) => (
    profile?.country ? (
        <SimpleCell before={<Icon28PlaceOutline />} subtitle={t(profile?.country)}>
            {profile?.city}
        </SimpleCell>
    ) : null
);

const Personality = ({ profile, t }: PersonalityProps) => (
    profile?.personality ? (
        <SimpleCell before={<Icon28MagicHatOutline />} subtitle={t("Personality")}>
            {t(profile?.personality)}
        </SimpleCell>
    ) : null
);

const Interests = ({ interests, t }: InterestsProps) => (
    interests?.length ? (
        <SimpleCell before={<Icon28EditOutline />} subtitle={t("Interests")}>
            <div className="flex flex-wrap gap-2">
                {interests?.map((interest, index) => (
                    <ContentBadge
                        key={index}
                        size="l"
                        appearance="accent"
                        mode="primary"
                        capsule={false}
                    >
                        {t(interest)}
                    </ContentBadge>
                ))}
            </div>
        </SimpleCell>
    ) : null
);

const DetailsSkeleton = () => (
    [...Array(5)].map((_, i) => (
        <SimpleCell
            key={i}
            before={<Skeleton width={28} height={28} borderRadius="15%" />}
            subtitle={<Skeleton width={140} />}
        >
            <Skeleton width={100} />
        </SimpleCell>
    ))
);

const DetailsGroup = ({ profile, interests }: DetailsProps) => {
    const { t } = useTranslation();

    return (
        <>
            <Location profile={profile} t={t} />
            <Personality profile={profile} t={t} />
            <Interests interests={interests} t={t} />
        </>
    )
};

const Details = ({ profile, interests }: DetailsProps) => (
    <>
        <Group mode="plain">
            {!profile ?
                <DetailsSkeleton /> :
                <DetailsGroup profile={profile} interests={interests} />
            }
        </Group>
    </>
);

export default Details;
