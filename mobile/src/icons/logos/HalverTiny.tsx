import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type HalverTinyProps = ISvgProps;

export const HalverTiny: React.FunctionComponent<HalverTinyProps> = ({
  ...otherProps
}) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={16}
      viewBox="0 0 23 16"
      width={23}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <G clipPath="url(#a)">
        <Path d="M20 0H-3v7.5h23V0Z" fill="#EE8A79" />
        <Path d="M26 8.5H3V16h23V8.5Z" fill="#315D65" />
        <Path d="M14.5 16V0" stroke={colors.gray1} />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path d="M0 0h23v16H0z" fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
