import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type SmallCloseProps = ISvgProps;

export const SmallClose: React.FunctionComponent<SmallCloseProps> = ({ ...props }) => {
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
        d="M13.031 11.969a.75.75 0 1 1-1.062 1.062l-3.97-3.969-3.968 3.97a.756.756 0 0 1-1.226-.244.75.75 0 0 1 .164-.82L6.937 8 2.97 4.031A.751.751 0 1 1 4.03 2.97L8 6.937l3.969-3.968A.751.751 0 0 1 13.03 4.03L9.062 8l3.97 3.969Z"
        fill={colors.gray11}
        fillOpacity={0.8}
      />
    </Svg>
  );
};
