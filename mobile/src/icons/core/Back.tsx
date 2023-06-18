import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type BackProps = ISvgProps;

export const Back: React.FunctionComponent<BackProps> = ({ ...props }) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={18}
      viewBox="0 0 11 18"
      width={11}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9 17.625a1.144 1.144 0 0 1-.797-.328l-7.5-7.5a1.125 1.125 0 0 1 0-1.594l7.5-7.5a1.127 1.127 0 1 1 1.594 1.594L3.094 9l6.703 6.703A1.125 1.125 0 0 1 9 17.625Z"
        fill={colors.gray12}
      />
    </Svg>
  );
};
