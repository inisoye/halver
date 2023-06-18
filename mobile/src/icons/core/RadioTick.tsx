import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type RadioTickProps = ISvgProps;

export const RadioTick: React.FunctionComponent<RadioTickProps> = ({ ...props }) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={9}
      viewBox="0 0 13 9"
      width={13}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M4.251 8.751a.763.763 0 0 1-.531-.218l-3.5-3.5A.751.751 0 0 1 1.283 3.97L4.25 6.939 10.721.47a.75.75 0 0 1 1.224.819.751.751 0 0 1-.162.244l-7 7a.763.763 0 0 1-.532.218Z"
        fill={colors.gray1}
      />
    </Svg>
  );
};
