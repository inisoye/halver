import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';
import { useIsDarkMode } from '@/utils';

type NewBillProps = ISvgProps;

export const NewBill: React.FunctionComponent<NewBillProps> = ({ ...otherProps }) => {
  const isDarkMode = useIsDarkMode();
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={44}
      viewBox="0 0 44 44"
      width={44}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <Rect
        fill={isDarkMode ? colors.apricot6 : '#F3C1B9'}
        height={44}
        rx={8}
        width={44}
      />
      <Path
        d="M34 22a1 1 0 0 1-1 1H23v10a1 1 0 0 1-2 0V23H11a1 1 0 0 1 0-2h10V11a1 1 0 0 1 2 0v10h10a1 1 0 0 1 1 1Z"
        fill={isDarkMode ? colors.gray1 : '#844439'}
      />
    </Svg>
  );
};
