import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type RightArrowProps = ISvgProps;

export const RightArrow: React.FunctionComponent<RightArrowProps> = ({ ...props }) => {
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
        d="m20.78 12.53-6.75 6.75a.75.75 0 0 1-1.06-1.06l5.47-5.47H3.75a.75.75 0 1 1 0-1.5h14.69l-5.47-5.47a.75.75 0 1 1 1.06-1.06l6.75 6.75a.75.75 0 0 1 0 1.06Z"
        fill={colors.gray11}
        fillOpacity={0.5}
      />
    </Svg>
  );
};
