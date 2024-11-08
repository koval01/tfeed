import { Dispatch, SetStateAction, useState } from "react";

import { ProfileDetails, UpdateProfileProps } from "@/types";

import { Switch } from "@vkontakte/vkui";

interface VisibilitySwitch {
    profile: ProfileDetails | undefined;
    onUpdate: (profile: Partial<UpdateProfileProps>, setWait: Dispatch<SetStateAction<boolean>>) => Promise<boolean | undefined>;
}

export const VisibilitySwitch = ({ profile, onUpdate }: VisibilitySwitch) => {
    const [wait, setWait] = useState<boolean>(false);
    
    return (
        <Switch
            defaultChecked={profile?.visible}
            onChange={(e: any) => onUpdate({ visible: e.target.checked }, setWait)}
            disabled={wait} />
    )
}
