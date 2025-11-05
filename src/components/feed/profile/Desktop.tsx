import { memo } from "react";

import {
    Button,
    ButtonGroup,
    CustomScrollView,
    EllipsisText,
    Group,
    SimpleCell,
    SplitCol
} from "@vkontakte/vkui";

import { Avatar } from "@/components/avatar/Avatar";
import { t } from "i18next";
import { useModal } from "@/contexts/ModalContext";
import { useChannelsStorage } from "@/hooks/utils/useChannelStorage";

const Body = () => {
    const {channels, isLoading: isChannelsLoading} = useChannelsStorage();

    return (
        <CustomScrollView className="h-96">
            {isChannelsLoading ? (
                <p></p>
            ) : (
                    channels &&
                    Object.values(channels).map((channel, index) => (
                    <SimpleCell
                        key={`feed_d_ch_${index}`}
                        before={<Avatar size={48} src={channel.avatar} />}
                        subtitle={<EllipsisText>{channel.description}</EllipsisText>}
                        className="py-1.5"
                    >
                        <EllipsisText>{channel.title}</EllipsisText>
                    </SimpleCell>
                ))
            )}
        </CustomScrollView>
    );
}

export const Profile = memo(() => {
    const { openModal } = useModal();

    return (
        <SplitCol className="max-lg:hidden pt-3 ScrollStickyWrapper" width={280} maxWidth={280}>
            <div className="fixed w-[345px]">
                <Group className="select-none p-0" mode="plain">
                    <div className="relative block border dark:border-[#2f3336] rounded-2xl">
                        <Body />
                    </div>
                </Group>
                <div className="block pt-4 m-auto">
                    <ButtonGroup mode="vertical" gap="m" className="min-w-48 block">
                        <Button onClick={openModal} size="l" appearance="accent" stretched>
                            {t("Edit")}
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </SplitCol>
    )
});

Profile.displayName = "Profile";
