'use client';

import * as React from 'react';

import { Spinner, Button as VKButton, type ButtonProps } from '@vkontakte/vkui';

export interface CustomButtonProps {
    loader?: React.ReactNode;
}

export interface VKUIButtonProps extends ButtonProps, CustomButtonProps { }

const Loader = ({ loader }: { loader?: React.ReactNode }) => (
    <div className="inline-block align-super">
        {loader}
    </div>
)

/**
 * Modified component Buttom from VK UI lib
 * @see https://vkcom.github.io/VKUI/#/Button
 */
export const Button = ({
    loader, // Custom loader
    loading, // Whether the button is in a loading state
    children,
    ...restProps
}: VKUIButtonProps): React.ReactNode => {
    return (
        <VKButton {...restProps} loading={false}>
            {
                loading
                    ? (loader && <Loader loader={loader} />) || (
                        <Spinner
                            size="small"
                            disableAnimation={restProps.disableSpinnerAnimation}
                            noColor
                        />
                    )
                    : children
            }
        </VKButton>
    );
};
