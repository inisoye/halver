import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type SearchProps = ISvgProps;

export const SmallSearch: React.FunctionComponent<SearchProps> = ({ ...props }) => {
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
        d="m14.356 13.644-2.706-2.7a5.762 5.762 0 1 0-.707.706l2.7 2.706a.512.512 0 0 0 .713 0 .507.507 0 0 0 0-.712ZM2.5 7.25A4.75 4.75 0 1 1 7.25 12 4.757 4.757 0 0 1 2.5 7.25Z"
        fill={colors.gray9}
      />
    </Svg>
  );
};

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
