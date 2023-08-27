import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type EditPencilProps = ISvgProps;

export const EditPencil: React.FunctionComponent<EditPencilProps> = ({ ...props }) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={14}
      viewBox="0 0 14 14"
      width={14}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M13.277 4.644 11.2 6.72 7.28 2.8 9.357.725a.56.56 0 0 1 .791 0l3.129 3.127a.56.56 0 0 1 0 .793Z"
        fill={colors.gray11}
        opacity={0.2}
      />
      <Path
        d="M13.672 3.456 10.544.328a1.12 1.12 0 0 0-1.584 0L.328 8.96A1.11 1.11 0 0 0 0 9.752v3.128A1.12 1.12 0 0 0 1.12 14h3.128a1.109 1.109 0 0 0 .792-.328l8.632-8.632a1.12 1.12 0 0 0 0-1.584ZM1.352 9.52 7.28 3.592 8.448 4.76 2.52 10.688 1.352 9.52Zm-.232 1.352 2.008 2.008H1.12v-2.008Zm3.36 1.776L3.312 11.48 9.24 5.552l1.168 1.168-5.928 5.928Zm6.72-6.72L8.072 2.8l1.68-1.68 3.128 3.128-1.68 1.68Z"
        fill={colors.gray11}
      />
    </Svg>
  );
};
