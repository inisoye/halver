import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type SelectInactiveItemProps = ISvgProps;

export const SelectInactiveItem: React.FunctionComponent<SelectInactiveItemProps> = ({
  ...props
}) => {
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
      <Circle cx={10} cy={10} r={9.25} stroke={colors.gray8} strokeWidth={1.5} />
    </Svg>
  );
};
