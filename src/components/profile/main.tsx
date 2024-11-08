import { CSSProperties } from 'react';
import { useRouter } from "next/navigation";

import { ProfileDetails } from '@/types';

import { Gradient, Skeleton, Title, Text, Button, Avatar, Popover, Div } from '@vkontakte/vkui';

import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Icon20Verified } from '@vkontakte/icons';

interface MainProps {
    profile: ProfileDetails | undefined
}

interface ProfileAvatarProps extends MainProps { };

interface ProfileStatusProps extends MainProps {
    t: TFunction<"translation", undefined>
};

interface ProfileTitleProps extends ProfileStatusProps { };
interface ProfileButtons extends ProfileStatusProps { };
interface ProfileVerifiedProps extends ProfileStatusProps { };

const profileStyles: CSSProperties = {
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 32,
};

const ProfileAvatar = ({ profile }: ProfileAvatarProps) => (
    !profile ?
        <Skeleton width={96} height={96} borderRadius="50%" /> :
        profile?.avatar ?
            <Avatar size={96} src={profile?.avatar} /> :
            <Avatar size={96} src="#" initials={profile.displayName.slice(0, 1)} />
);

const VerifiedComponent = ({ profile, t }: ProfileVerifiedProps) => (
    <>
        {' '}{profile?.verified &&
            <Popover
                trigger="hover"
                placement="bottom"
                role="tooltip"
                aria-describedby="tooltip-1"
                content={
                    <Div>
                        <Text>{t("This user is verified")}</Text>
                    </Div>
                }
            >
                <Icon20Verified style={{
                    display: 'inline-block',
                    color: 'var(--vkui--color_icon_accent)',
                    verticalAlign: 'text-top',
                }} />
            </Popover>
        }
    </>
);

const ProfileTitle = ({ profile, t }: ProfileTitleProps) => (
    <Title style={{ marginBottom: 8, marginTop: 20 }} level="2" weight="2">
        {!profile ? <Skeleton width={160} /> : profile?.displayName}
        <VerifiedComponent profile={profile} t={t} />
    </Title>
);

const ProfileStatus = ({ profile, t }: ProfileStatusProps) => (
    <Text
        style={{
            marginBottom: 24,
            color: 'var(--vkui--color_text_secondary)',
        }}
    >
        {!profile ? <Skeleton width={100} /> : profile.visible !== void 0 && (profile?.visible ? `${t("Visible")} 😋` : `${t("Hidden")} 😎`)}
    </Text>
);

const ProfileButtons = ({ profile, t }: ProfileButtons) => {
    const router = useRouter();

    return (
        !profile ?
            <Skeleton width={80} height={32} />
            :
            profile.visible !== void 0 && <Button
                size="m"
                mode="secondary"
                disabled={false}
                onClick={() => router.push("/settings")}
            >
                {t("Edit")}
            </Button>
    )
};

const Main = ({ profile }: MainProps) => {
    const { t } = useTranslation();

    return (
        <Gradient mode="tint" to="top" style={profileStyles}>
            <div style={{
                backgroundImage: `url(${profile?.avatar || ""})`
            }} className="absolute opacity-25 blur-3xl w-full h-64 bg-contain"></div>
            <ProfileAvatar profile={profile} />
            <ProfileTitle profile={profile} t={t} />
            <ProfileStatus profile={profile} t={t} />
            <ProfileButtons profile={profile} t={t} />
        </Gradient>
    );
}

export default Main;
