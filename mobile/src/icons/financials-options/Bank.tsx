import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type BankProps = ISvgProps;

export const Bank: React.FunctionComponent<BankProps> = ({ ...props }) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={24}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M21.75 9H2.25L12 3l9.75 6Z" fill={colors.gray11} opacity={0.2} />
      <Path
        d="M2.25 9.75H4.5v6H3a.75.75 0 1 0 0 1.5h18a.75.75 0 1 0 0-1.5h-1.5v-6h2.25a.75.75 0 0 0 .393-1.388l-9.75-6a.75.75 0 0 0-.786 0l-9.75 6A.75.75 0 0 0 2.25 9.75Zm3.75 0h3v6H6v-6Zm7.5 0v6h-3v-6h3Zm4.5 6h-3v-6h3v6ZM12 3.88l7.1 4.37H4.9L12 3.88ZM23.25 19.5a.75.75 0 0 1-.75.75h-21a.75.75 0 1 1 0-1.5h21a.75.75 0 0 1 .75.75Z"
        fill={colors.gray11}
      />
    </Svg>
  );
};
