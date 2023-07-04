import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type SmallAlertProps = ISvgProps;

export const SmallAlert: React.FunctionComponent<SmallAlertProps> = ({ ...props }) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={12}
      viewBox="0 0 12 12"
      width={12}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M5.875 3.708v2.167m0 2.167h.005M5.875 1c3.9 0 4.875.975 4.875 4.875s-.975 4.875-4.875 4.875S1 9.775 1 5.875 1.975 1 5.875 1Z"
        stroke={colors.gray1}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
    </Svg>
  );
};
