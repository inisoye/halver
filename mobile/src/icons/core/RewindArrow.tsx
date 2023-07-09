import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type RewindArrowProps = ISvgProps;

export const RewindArrow: React.FunctionComponent<RewindArrowProps> = ({
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
      <Path
        d="M17.813 10a7.812 7.812 0 0 1-7.708 7.813H10a7.765 7.765 0 0 1-5.36-2.132.938.938 0 0 1 1.287-1.364 5.937 5.937 0 1 0-.123-8.515l-.03.028-1.486 1.358h1.337a.937.937 0 1 1 0 1.875h-3.75a.937.937 0 0 1-.938-.938v-3.75a.937.937 0 1 1 1.875 0v1.619l1.679-1.536A7.813 7.813 0 0 1 17.813 10Z"
        fill={colors.textWhite}
      />
    </Svg>
  );
};
