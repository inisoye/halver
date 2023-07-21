import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type ThreeUsersClusterProps = ISvgProps & {
  isDark?: boolean;
};

export const ThreeUsersCluster: React.FunctionComponent<ThreeUsersClusterProps> = ({
  ...props
}) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={32}
      viewBox="0 0 32 32"
      width={32}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M30.45 18.6a.751.751 0 0 1-1.05-.15 6.697 6.697 0 0 0-5.4-2.7.75.75 0 1 1 0-1.5 3.25 3.25 0 1 0-3.148-4.063.75.75 0 1 1-1.452-.374 4.75 4.75 0 1 1 7.489 4.953A8.212 8.212 0 0 1 30.6 17.55a.75.75 0 0 1-.15 1.05Zm-6.801 8.025a.75.75 0 0 1-1.299.751 7.375 7.375 0 0 0-12.703 0 .751.751 0 1 1-1.297-.75 8.763 8.763 0 0 1 4.525-3.807 5.75 5.75 0 1 1 6.262 0 8.763 8.763 0 0 1 4.512 3.806ZM16 22.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5ZM8.75 15a.75.75 0 0 0-.75-.75 3.249 3.249 0 0 1-1.127-6.298 3.25 3.25 0 0 1 4.275 2.234.75.75 0 1 0 1.452-.375 4.75 4.75 0 1 0-7.489 4.954A8.212 8.212 0 0 0 1.4 17.55a.75.75 0 0 0 1.2.9 6.697 6.697 0 0 1 5.4-2.7.75.75 0 0 0 .75-.75Z"
        fill={colors.gray11}
      />
    </Svg>
  );
};
