import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type PlusProps = ISvgProps;

export const Plus: React.FunctionComponent<PlusProps> = ({ ...props }) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={20}
      viewBox="0 0 20 20"
      width={20}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M19.375 10a1.125 1.125 0 0 1-1.125 1.125h-7.125v7.125a1.125 1.125 0 1 1-2.25 0v-7.125H1.75a1.125 1.125 0 1 1 0-2.25h7.125V1.75a1.125 1.125 0 0 1 2.25 0v7.125h7.125A1.125 1.125 0 0 1 19.375 10Z"
        fill={colors.gray12}
      />
    </Svg>
  );
};
