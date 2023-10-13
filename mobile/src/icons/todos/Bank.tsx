import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type AddBankProps = ISvgProps;

export const AddBank: React.FunctionComponent<AddBankProps> = ({
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
        d="M18.125 7.5H1.875L10 2.5l8.125 5Z"
        fill={colors.plum9}
        opacity={0.2}
      />
      <Path
        d="M1.875 8.125H3.75v5H2.5a.625.625 0 1 0 0 1.25h15a.625.625 0 0 0 0-1.25h-1.25v-5h1.875a.625.625 0 0 0 .327-1.157l-8.125-5a.625.625 0 0 0-.654 0l-8.125 5a.625.625 0 0 0 .327 1.157Zm3.125 0h2.5v5H5v-5Zm6.25 0v5h-2.5v-5h2.5Zm3.75 5h-2.5v-5H15v5Zm-5-9.891 5.917 3.641H4.083L10 3.234Zm9.375 13.016a.625.625 0 0 1-.625.625H1.25a.625.625 0 0 1 0-1.25h17.5a.625.625 0 0 1 .625.625Z"
        fill={colors.plum9}
      />
    </Svg>
  );
};
