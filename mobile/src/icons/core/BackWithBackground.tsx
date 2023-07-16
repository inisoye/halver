import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';
import { useIsDarkMode } from '@/utils';

type BackWithBackgroundProps = ISvgProps;

export const BackWithBackground: React.FunctionComponent<BackWithBackgroundProps> = ({
  ...props
}) => {
  const { colors } = useTheme<Theme>();
  const isDarkMode = useIsDarkMode();

  return (
    <Svg
      fill="none"
      height={40}
      viewBox="0 0 40 40"
      width={40}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={20} cy={20} fill={isDarkMode ? colors.gray3 : colors.grayA8} r={20} />
      <Path
        d="M22.5 27.188a.953.953 0 0 1-.664-.274l-6.25-6.25a.94.94 0 0 1 0-1.328l6.25-6.25a.94.94 0 1 1 1.328 1.328L17.578 20l5.586 5.586a.938.938 0 0 1-.664 1.602Z"
        fill={isDarkMode ? colors.gray12 : colors.gray1}
      />
    </Svg>
  );
};
