import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type ThreeUsersClusterProps = ISvgProps & {
  isDark?: boolean;
};

export const ThreeUsersCluster: React.FunctionComponent<
  ThreeUsersClusterProps
> = ({ ...props }) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={24}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M22.837 13.95a.56.56 0 0 1-.787-.112A5.023 5.023 0 0 0 18 11.813a.562.562 0 1 1 0-1.126 2.438 2.438 0 1 0-2.36-3.046.563.563 0 0 1-1.09-.282 3.563 3.563 0 1 1 5.617 3.716 6.158 6.158 0 0 1 2.783 2.088.563.563 0 0 1-.113.787Zm-5.1 6.019a.562.562 0 1 1-.974.563 5.53 5.53 0 0 0-9.527 0 .563.563 0 1 1-.973-.562 6.572 6.572 0 0 1 3.393-2.856 4.312 4.312 0 1 1 4.697 0 6.572 6.572 0 0 1 3.384 2.855ZM12 16.687a3.187 3.187 0 1 0 0-6.374 3.187 3.187 0 0 0 0 6.374ZM6.562 11.25A.563.563 0 0 0 6 10.687 2.437 2.437 0 1 1 8.36 7.64a.562.562 0 1 0 1.09-.282 3.562 3.562 0 1 0-5.617 3.716 6.159 6.159 0 0 0-2.783 2.088.563.563 0 0 0 .9.675A5.023 5.023 0 0 1 6 11.814a.562.562 0 0 0 .563-.563Z"
        fill={colors.gray11}
      />
    </Svg>
  );
};
