import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type RewindProps = ISvgProps;

export const Rewind: React.FunctionComponent<RewindProps> = ({ ...props }) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      height={24}
      viewBox="0 0 256 256"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G fill={colors.gray11}>
        <Path d="M216 128a88 88 0 1 1-88-88a88 88 0 0 1 88 88Z" opacity={0.2} />
        <Path d="M136 80v43.47l36.12 21.67a8 8 0 0 1-8.24 13.72l-40-24A8 8 0 0 1 120 128V80a8 8 0 0 1 16 0Zm-8-48a95.44 95.44 0 0 0-67.92 28.15C52.81 67.51 46.35 74.59 40 82V64a8 8 0 0 0-16 0v40a8 8 0 0 0 8 8h40a8 8 0 0 0 0-16H49c7.15-8.42 14.27-16.35 22.39-24.57a80 80 0 1 1 1.66 114.75a8 8 0 1 0-11 11.64A96 96 0 1 0 128 32Z" />
      </G>
    </Svg>
  );
};
