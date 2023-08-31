import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

interface AccountProps extends ISvgProps {
  focused?: boolean;
}

export const Account: React.FunctionComponent<AccountProps> = ({
  focused,
  ...otherProps
}) => {
  const { colors } = useTheme<Theme>();

  if (focused) {
    return (
      <Svg
        fill="none"
        height={19}
        viewBox="0 0 20 19"
        width={20}
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <Path
          d="M19.65 18.625A.752.752 0 0 1 19 19H1a.75.75 0 0 1-.649-1.125c1.428-2.468 3.628-4.238 6.196-5.077a6.75 6.75 0 1 1 6.906 0c2.568.839 4.768 2.609 6.196 5.077a.75.75 0 0 1 0 .75Z"
          fill={colors.gray12}
        />
      </Svg>
    );
  }

  return (
    <Svg
      fill="none"
      height={20}
      viewBox="0 0 20 20"
      width={20}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <Path
        d="M19.74 17.875a11.316 11.316 0 0 0-6.29-5.081 6.75 6.75 0 1 0-6.9 0 11.316 11.316 0 0 0-6.29 5.08.75.75 0 1 0 1.293.75 9.759 9.759 0 0 1 16.894 0 .751.751 0 1 0 1.294-.75ZM4.75 7a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"
        fill={colors.gray10}
      />
    </Svg>
  );
};
