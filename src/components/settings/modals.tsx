import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import Modal from "./modal";

import { ProfileDetails, UpdateProfileProps } from "@/types";

import { personalities } from "@/defined/personalities";
import { interests as interestsOptions } from "@/defined/interests";
import { countries } from "@/defined/countries";

import { ChipsSelect, CustomSelect, Div, FormItem, Input, Select, Textarea } from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";
import { t } from "i18next";

interface ProfileProp {
    profile: ProfileDetails | undefined;
}
interface InterestsProp {
    interests: string[] | undefined
}
interface ProfileOnUpdateProp {
    onUpdate: (profile: Partial<UpdateProfileProps>, setWait: Dispatch<SetStateAction<boolean>>) => Promise<boolean | undefined>;
}
interface InterestsOnUpdateProp {
    onUpdate: (interests: string[], setWait: Dispatch<SetStateAction<boolean>>) => Promise<boolean | undefined>;
}
interface DeleteOnUpdateProp {
    onUpdate: () => void;
}
interface BaseModalProps {
    setPopout: (value: SetStateAction<JSX.Element | null>) => void;
}
interface ModalDisplayNameProps extends ProfileProp, BaseModalProps, ProfileOnUpdateProp { }
interface ModalBioProps extends ProfileProp, BaseModalProps, ProfileOnUpdateProp { };
interface ModalPersonalityProps extends ProfileProp, BaseModalProps, ProfileOnUpdateProp { };
interface ModalInterestsProps extends InterestsProp, BaseModalProps, InterestsOnUpdateProp { };
interface ModalDeleteAccount extends BaseModalProps, DeleteOnUpdateProp { }

export const ModalDisplayName = ({ profile, setPopout, onUpdate }: ModalDisplayNameProps) => {
    const [wait, setWait] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<string>(profile?.displayName || "");

    return (
        <Modal
            header={"Display name"}
            subheader={"Display name subhead"}
            content={
                <FormItem>
                    <Input
                        type="text"
                        defaultValue={profile?.displayName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(
                            e.target.value
                        )}
                        value={displayName}
                        disabled={wait}
                    />
                </FormItem>
            }
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate({ displayName: displayName.trim() }, setWait).then((r) => !!r && setPopout(null))}
            disabled={wait}
        />
    )
}

export const ModalBio = ({ profile, setPopout, onUpdate }: ModalBioProps) => {
    const { t } = useTranslation();

    const [wait, setWait] = useState<boolean>(false);
    const [bio, setBio] = useState<string>(profile?.description || "");

    return (
        <Modal
            header={"Bio"}
            subheader={"Bio subhead"}
            content={
                <FormItem>
                    <Textarea
                        placeholder={t("Bio placeholder")}
                        defaultValue={profile?.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                        disabled={wait}
                        rows={8}
                        style={{ height: "auto" }}
                    />
                </FormItem>
            }
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate({ description: bio }, setWait).then((r) => !!r && setPopout(null))}
            disabled={wait}
        />
    )
}

export const ModalInterests = ({ interests, setPopout, onUpdate }: ModalInterestsProps) => {
    const { t } = useTranslation();
    const [wait, setWait] = useState<boolean>(false);

    const getArray = useCallback((arr: string[] | undefined) =>
        arr?.map((interest: string) => ({ value: interest, label: t(interest) })), [t]);

    const interestsCollection = useMemo(() => {
        if (!interests) return [];
        return getArray([...interests, ...interestsOptions]);
    }, [interests, getArray]);

    const [selectedInterests, setSelectedInterests] = useState<{ value: string; label: string; }[] | undefined>(() => getArray(interests));

    return (
        <Modal
            header={"Interests"}
            subheader={"Interests subhead"}
            content={
                <FormItem>
                    <ChipsSelect
                        id="interests"
                        value={selectedInterests}
                        onChange={setSelectedInterests}
                        options={interestsCollection}
                        placeholder={t("Nothing selected")}
                        creatable={t("Add interest")}
                        disabled={wait}
                    />
                </FormItem>
            }
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate(selectedInterests?.map(item => item.value) || [], setWait).then((r) => !!r && setPopout(null))}
            disabled={wait}
        />
    )
}

export const ModalPersonality = ({ profile, setPopout, onUpdate }: ModalPersonalityProps) => {
    const { t } = useTranslation();

    const [wait, setWait] = useState<boolean>(false);
    const [personality, setPersonality] = useState<string>(profile?.personality || "");

    return (
        <Modal
            header={"Personality"}
            subheader={"Personality subhead"}
            content={
                <FormItem>
                    <Select
                        id="select-id"
                        placeholder={t("Not selected")}
                        options={personalities.map((personality, index) => ({
                            index: index,
                            label: `${t(personality)} (${personality})`,
                            value: personality
                        }))}
                        defaultValue={profile?.personality}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPersonality(e.target.value)}
                        disabled={wait}
                    />
                </FormItem>
            }
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate({ personality: personality }, setWait).then((r) => !!r && setPopout(null))}
            disabled={wait}
        />
    )
}

export const ModalLocation = ({ profile, setPopout, onUpdate }: ModalBioProps) => {
    const { t } = useTranslation();

    const [wait, setWait] = useState<boolean>(false);
    const [country, setCountry] = useState<string>(profile?.country || "");
    const [city, setCity] = useState<string>(profile?.city || "");

    const getArrayCountries = useCallback(() =>
        countries.map((country: string) => ({ value: country, label: t(country) })), [t]);

    return (
        <Modal
            header={"Location"}
            subheader={"Location subhead"}
            content={
                <>
                    <FormItem
                        top={t("Country")}
                        htmlFor="country-select-searchable"
                    >
                        <CustomSelect
                            placeholder={t("Enter country name")}
                            searchable
                            id="country-select-searchable"
                            options={getArrayCountries()}
                            allowClearButton
                            defaultValue={country}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}
                            disabled={wait}
                        />
                    </FormItem>
                    <FormItem
                        top={t("City")}
                        htmlFor="city-select-searchable"
                    >
                        <CustomSelect
                            placeholder={t("Enter city name")}
                            searchable
                            id="city-select-searchable"
                            options={[]}
                            allowClearButton
                            defaultValue={city}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCity(e.target.value)}
                            disabled={wait}
                        />
                    </FormItem>
                </>
            }
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate({ country: country, city: city }, setWait).then((r) => !!r && setPopout(null))}
            disabled={wait}
        />
    )
}

export const ModalDeleteAccount = ({ setPopout, onUpdate }: ModalDeleteAccount) => {
    const [wait, setWait] = useState<boolean>(false);

    return (
        <Modal
            header={"Delete account"}
            subheader={"Delete account subhead"}
            content={<Div />}
            onClose={() => setPopout(null)}
            onUpdate={() => onUpdate}
            disabled={wait}
            actionButtonText={t("Delete")}
        />
    )
}
