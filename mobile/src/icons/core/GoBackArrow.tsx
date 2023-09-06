import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type GoBackArrowProps = ISvgProps & {
  isLight?: boolean;
};

export const GoBackArrow: React.FunctionComponent<GoBackArrowProps> = ({
  ...props
}) => {
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
        d="M14.25 8a.75.75 0 0 1-.75.75H4.312l3.22 3.22a.751.751 0 0 1-1.062 1.062l-4.5-4.5a.75.75 0 0 1 0-1.063l4.5-4.5a.751.751 0 1 1 1.062 1.063L4.312 7.25H13.5a.75.75 0 0 1 .75.75Z"
        fill={props.isLight ? colors.textWhite : colors.green12}
      />
    </Svg>
  );
};
