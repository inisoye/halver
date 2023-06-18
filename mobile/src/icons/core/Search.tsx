import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type SearchProps = ISvgProps;

export const Search: React.FunctionComponent<SearchProps> = ({ ...props }) => {
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
        d="m17.945 17.055-3.383-3.375a7.203 7.203 0 1 0-.882.883l3.375 3.382a.64.64 0 0 0 .89 0 .633.633 0 0 0 0-.89ZM3.125 9.063A5.938 5.938 0 1 1 9.063 15a5.946 5.946 0 0 1-5.938-5.938Z"
        fill={colors.gray9}
      />
    </Svg>
  );
};
