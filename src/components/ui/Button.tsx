'use client';

import * as React from 'react';
import { Spinner, TappableProps, Button as VKButton, type ButtonProps as VKUIButtonProps } from '@vkontakte/vkui';

export interface CustomButtonProps {
    /** Custom loader element to show when loading is true */
    loader?: React.ReactNode;
    /** Whether the button is in a loading state */
    loading?: boolean;
}

export type ButtonProps = Omit<TappableProps, 'size'> & VKUIButtonProps & CustomButtonProps;

const Loader = ({ loader }: { loader?: React.ReactNode }) => (
    <div className="inline-block align-super">
        {loader}
    </div>
);

/**
 * Enhanced Button component based on VK UI with custom loader support
 * @see https://vkcom.github.io/VKUI/#/Button
 */
export const Button = ({
    loader,
    loading,
    children,
    ...restProps
}: ButtonProps): React.ReactNode => {
    // Create props for VKButton by excluding our custom props
    const vkButtonProps = restProps;

    return (
        <VKButton {...vkButtonProps} loading={loading}>
            {loading ? (
                loader ? (
                    <Loader loader={loader} />
                ) : (
                    <Spinner
                        size="s"
                        disableAnimation={restProps.disableSpinnerAnimation}
                        noColor
                    />
                )
            ) : (
                children
            )}
        </VKButton>
    );
};
