import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type CardProps = ISvgProps;

export const Card: React.FunctionComponent<CardProps> = ({ ...props }) => {
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
        d="M21.75 9v9a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V9h19.5Z"
        fill={colors.gray11}
        opacity={0.2}
      />
      <Path
        d="M21 4.5H3A1.5 1.5 0 0 0 1.5 6v12A1.5 1.5 0 0 0 3 19.5h18a1.5 1.5 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 21 4.5ZM21 6v2.25H3V6h18Zm0 12H3V9.75h18V18Zm-1.5-2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 1 1 0-1.5h3a.75.75 0 0 1 .75.75Zm-6 0a.75.75 0 0 1-.75.75h-1.5a.75.75 0 1 1 0-1.5h1.5a.75.75 0 0 1 .75.75Z"
        fill={colors.gray11}
      />
    </Svg>
  );
};
