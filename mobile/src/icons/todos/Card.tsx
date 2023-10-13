import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type AddCardProps = ISvgProps;

export const AddCard: React.FunctionComponent<AddCardProps> = ({
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
        d="M18.125 7.5V15a.624.624 0 0 1-.625.625h-15A.625.625 0 0 1 1.875 15V7.5h16.25Z"
        fill={colors.indigo11}
        opacity={0.2}
      />
      <Path
        d="M17.5 3.75h-15A1.25 1.25 0 0 0 1.25 5v10a1.25 1.25 0 0 0 1.25 1.25h15A1.25 1.25 0 0 0 18.75 15V5a1.25 1.25 0 0 0-1.25-1.25Zm0 1.25v1.875h-15V5h15Zm0 10h-15V8.125h15V15Zm-1.25-1.875a.624.624 0 0 1-.625.625h-2.5a.624.624 0 1 1 0-1.25h2.5a.624.624 0 0 1 .625.625Zm-5 0a.624.624 0 0 1-.625.625h-1.25a.625.625 0 1 1 0-1.25h1.25a.624.624 0 0 1 .625.625Z"
        fill={colors.indigo11}
      />
    </Svg>
  );
};
