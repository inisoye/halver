import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type SelectTickProps = ISvgProps;

export const SelectTick: React.FunctionComponent<SelectTickProps> = ({ ...props }) => {
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
        d="M14.789 7.163a.77.77 0 0 1-.03 1.087l-5.634 5.385a.78.78 0 0 1-1.067 0L5.24 10.942a.77.77 0 1 1 1.058-1.115l2.289 2.183 5.115-4.875a.77.77 0 0 1 1.087.028ZM20 10A10 10 0 1 1 10 0a10.02 10.02 0 0 1 10 10Zm-1.538 0A8.461 8.461 0 1 0 10 18.462 8.47 8.47 0 0 0 18.462 10Z"
        fill={colors.green11}
      />
    </Svg>
  );
};
