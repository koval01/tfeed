import { Dispatch, SetStateAction, useState } from "react";

import { UpdateProfileProps, ProfileDetails } from "@/types";

import {
    Icon28CompassOutline,
    Icon28DeleteOutline,
    Icon28GhostOutline,
    Icon28ListAddOutline,
    Icon28MagicHatOutline,
    Icon28MasksOutline,
    Icon28WriteOutline,
    Icon36ChevronRightOutline
} from "@vkontakte/icons";
import { CellButton, SimpleCell, Group, EllipsisText } from "@vkontakte/vkui";

import Skeleton from "./skeleton";

import { VisibilitySwitch } from "./switchs";
import { ModalBio, ModalDeleteAccount, ModalDisplayName, ModalInterests, ModalLocation, ModalPersonality } from "./modals";

import i18next, { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

interface LocalizationProps {
    t: TFunction<"translation", undefined>
}
interface OnUpdateProfileProp {
    onUpdateProfileData: (profile: Partial<UpdateProfileProps>) => Promise<boolean | undefined>;
}
interface OnUpdateInterestsProp {
    onUpdateInterestsData: (interests: string[]) => Promise<boolean | undefined>;
}
interface onUpdateDeleteAccountActionProp {
    onUpdateDeleteAccountAction: () => Promise<boolean | undefined>;
}
interface SetPopoutProps {
    setPopout: Dispatch<SetStateAction<JSX.Element | null>>;
}
interface FirstBlockProps extends LocalizationProps, OnUpdateProfileProp, SetPopoutProps {
    profile: ProfileDetails | undefined;
}
interface SecondBlockProps extends LocalizationProps, OnUpdateInterestsProp, SetPopoutProps {
    interests: string[] | undefined;
}
interface ButtonsBlock extends LocalizationProps, onUpdateDeleteAccountActionProp, SetPopoutProps {}
interface MainProps extends OnUpdateProfileProp, OnUpdateInterestsProp {
    profile: ProfileDetails | undefined;
    interests: string[] | undefined;
}

const FirstBlock = ({ profile, t, onUpdateProfileData, setPopout }: FirstBlockProps) => {
    const onUpdateProfile = async (profile: Partial<UpdateProfileProps>, setWait: Dispatch<SetStateAction<boolean>>) => {
        setWait(true);
        const r = await onUpdateProfileData(profile);
        setWait(false);
        return r;
    }

    return (
        <>
            <CellButton
                indicator={<EllipsisText className="max-w-52">{profile?.displayName}</EllipsisText>}
                before={<Icon28MasksOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => setPopout(
                    <ModalDisplayName
                        profile={profile}
                        setPopout={setPopout}
                        onUpdate={onUpdateProfile} />
                )}
            >
                {t("Display name")}
            </CellButton>
            <CellButton
                indicator={<EllipsisText className="max-w-52">{profile?.description}</EllipsisText>}
                before={<Icon28ListAddOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => setPopout(
                    <ModalBio
                        profile={profile}
                        setPopout={setPopout}
                        onUpdate={onUpdateProfile} />
                )}
            >
                {t("Bio")}
            </CellButton>
            <SimpleCell
                indicator={profile?.visible ? `${t("Visible")} 😋` : `${t("Hidden")} 😎`}
                before={<Icon28GhostOutline />}
                after={<VisibilitySwitch profile={profile} onUpdate={onUpdateProfile} />}
            >
                {t("Visible")}
            </SimpleCell>
            <CellButton
                indicator={<EllipsisText className="max-w-52">{
                    [t(profile?.country || ""), profile?.city].join(", ")
                }</EllipsisText>}
                before={<Icon28CompassOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => setPopout(
                    <ModalLocation
                        profile={profile}
                        setPopout={setPopout}
                        onUpdate={onUpdateProfile} />
                )}
            >
                {t("Location")}
            </CellButton>
            <CellButton
                indicator={t(profile?.personality || "Unknown")}
                before={<Icon28MagicHatOutline />}
                after={<Icon36ChevronRightOutline />}
                onClick={() => setPopout(
                    <ModalPersonality
                        profile={profile}
                        setPopout={setPopout}
                        onUpdate={onUpdateProfile} />
                )}
            >
                {t("Personality")}
            </CellButton>
        </>
    )
}

const SecondBlock = ({ interests, t, onUpdateInterestsData, setPopout }: SecondBlockProps) => {
    const onUpdateInterests = async (interests: string[], setWait: Dispatch<SetStateAction<boolean>>) => {
        setWait(true);
        const r = await onUpdateInterestsData(interests);
        setWait(false);
        return r;
    }

    return (
        <CellButton
            indicator={interests?.length}
            before={<Icon28WriteOutline />}
            after={<Icon36ChevronRightOutline />}
            onClick={() => setPopout(
                <ModalInterests
                    interests={interests}
                    setPopout={setPopout}
                    onUpdate={onUpdateInterests} />
            )}
        >
            {t("Interests")}
        </CellButton>
    )
};

const ButtonsBlock = ({ t, setPopout }: ButtonsBlock) => {
    return (
        <CellButton
            onClick={() => setPopout(
                <ModalDeleteAccount
                    setPopout={setPopout}
                    onUpdate={() => { }} />
            )}
            before={<Icon28DeleteOutline />}
            mode="danger"
        >
            {t("Delete account")}
        </CellButton>
    )
}

const Main = ({ profile, interests, onUpdateProfileData, onUpdateInterestsData }: MainProps) => {
    const { t } = useTranslation();

    const [popout, setPopout] = useState<React.JSX.Element | null>(null);

    return (
        <>
            <Group>
                <Group mode="plain">
                    {!profile ?
                        <Skeleton count={5} /> :
                        <FirstBlock
                            profile={profile}
                            t={t}
                            onUpdateProfileData={onUpdateProfileData}
                            setPopout={setPopout} />
                    }
                </Group>
                <Group mode="plain">
                    {!interests ?
                        <Skeleton count={1} /> :
                        <SecondBlock
                            interests={interests}
                            t={t}
                            onUpdateInterestsData={onUpdateInterestsData}
                            setPopout={setPopout} />
                    }
                </Group>
                <Group mode="plain" description={t("Settings description")}>
                    {!profile ?
                        <Skeleton count={1} /> :
                        <ButtonsBlock 
                            t={t} 
                            onUpdateDeleteAccountAction={async () => { return false; }}
                            setPopout={setPopout} />
                    }
                </Group>
            </Group>
            {popout}
        </>
    );
}

export default Main;
