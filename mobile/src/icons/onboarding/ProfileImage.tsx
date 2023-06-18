import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type ProfileImageProps = ISvgProps;

export const ProfileImage: React.FunctionComponent<ProfileImageProps> = ({
  ...otherProps
}) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={160}
      viewBox="0 0 160 160"
      width={160}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <Rect
        height={157}
        rx={14.5}
        stroke={colors.gray8}
        strokeWidth={3}
        width={157}
        x={1.5}
        y={1.5}
      />
      <Path
        d="M28 158.324A35.557 35.557 0 0 1 62.062 133h35.556a35.559 35.559 0 0 1 34.08 25.378M53.173 79.667a26.667 26.667 0 1 0 53.334 0 26.667 26.667 0 0 0-53.334 0Z"
        stroke={colors.gray8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
    </Svg>
  );
};
