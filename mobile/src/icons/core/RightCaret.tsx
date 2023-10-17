import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type RightCaretProps = ISvgProps & {
  isDark?: boolean;
};

export const RightCaret: React.FunctionComponent<RightCaretProps> = ({
  ...props
}) => {
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
        d="M2 17.625a1.124 1.124 0 0 1-.797-1.922L7.906 9 1.203 2.297A1.127 1.127 0 1 1 2.797.703l7.5 7.5a1.125 1.125 0 0 1 0 1.594l-7.5 7.5a1.144 1.144 0 0 1-.797.328Z"
        fill={props.isDark ? colors.gray12 : colors.gray10}
      />
    </Svg>
  );
};
