import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';
import { useIsDarkModeSelected } from '@/utils';

type CloseModalProps = ISvgProps;

export const CloseModal: React.FunctionComponent<CloseModalProps> = ({
  ...props
}) => {
  const isDarkMode = useIsDarkModeSelected();
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={40}
      viewBox="0 0 40 40"
      width={40}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle
        cx={20}
        cy={20}
        fill={isDarkMode ? colors.gray4 : colors.gray8}
        r={20}
      />
      <Path
        d="M26.289 24.961a.938.938 0 0 1-.664 1.6.945.945 0 0 1-.664-.272L20 21.33l-4.961 4.96a.945.945 0 0 1-1.532-.304.938.938 0 0 1 .204-1.024L18.67 20l-4.96-4.96a.94.94 0 1 1 1.328-1.329l4.96 4.96 4.962-4.96a.94.94 0 1 1 1.328 1.328L21.328 20l4.96 4.961Z"
        fill={colors.gray11}
      />
    </Svg>
  );
};
