import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';
import { useIsDarkModeSelected } from '@/utils';

type MastercardProps = ISvgProps;

export const Mastercard: React.FunctionComponent<MastercardProps> = ({ ...props }) => {
  const isDarkMode = useIsDarkModeSelected();
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={24}
      viewBox="0 0 37 24"
      width={37}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        fill={isDarkMode ? colors.gray12 : colors.gray6}
        height={24}
        rx={4}
        width={36.67}
      />
      <Path d="M15.379 7.337h5.469v9.826h-5.47V7.337Z" fill="#FF5F00" />
      <Path
        d="M15.726 12.25c0-1.996.937-3.767 2.378-4.913A6.246 6.246 0 0 0 8 12.25a6.246 6.246 0 0 0 10.104 4.913 6.24 6.24 0 0 1-2.378-4.913Z"
        fill="#EB001B"
      />
      <Path
        d="M28.226 12.25a6.246 6.246 0 0 1-10.104 4.913A6.214 6.214 0 0 0 20.5 12.25a6.267 6.267 0 0 0-2.378-4.913A6.211 6.211 0 0 1 21.976 6a6.257 6.257 0 0 1 6.25 6.25Z"
        fill="#F79E1B"
      />
    </Svg>
  );
};
