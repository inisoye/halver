import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type GoToArrowProps = ISvgProps;

export const GoToArrow: React.FunctionComponent<GoToArrowProps> = ({ ...props }) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={16}
      viewBox="0 0 16 16"
      width={16}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M12.75 4v6.5a.75.75 0 1 1-1.5 0V5.812l-6.719 6.72a.756.756 0 0 1-1.226-.244.75.75 0 0 1 .164-.82l6.718-6.718H5.5a.75.75 0 0 1 0-1.5H12a.75.75 0 0 1 .75.75Z"
        fill={colors.green12}
      />
    </Svg>
  );
};
