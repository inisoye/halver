import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

interface FinancialsProps extends ISvgProps {
  focused?: boolean;
}

export const Financials: React.FunctionComponent<FinancialsProps> = ({
  focused,
  ...otherProps
}) => {
  const { colors } = useTheme<Theme>();

  if (focused) {
    return (
      <Svg
        fill="none"
        height={26}
        viewBox="0 0 26 26"
        width={26}
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <Path
          d="M21.125 4.875H4.875a2.437 2.437 0 0 0-2.438 2.438v11.375a2.437 2.437 0 0 0 2.438 2.437h16.25a2.438 2.438 0 0 0 2.438-2.438V7.313a2.438 2.438 0 0 0-2.438-2.437Zm-5.736 7.801a2.438 2.438 0 0 1-4.774 0 1.625 1.625 0 0 0-1.595-1.301H4.063V9.75h17.875v1.625H16.98a1.625 1.625 0 0 0-1.591 1.301ZM4.875 6.5h16.25a.812.812 0 0 1 .813.813v.812H4.063v-.813a.812.812 0 0 1 .812-.812Z"
          fill={colors.gray10}
        />
      </Svg>
    );
  }

  return (
    <Svg
      fill="none"
      height={26}
      viewBox="0 0 26 26"
      width={26}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <Path
        d="M21.125 4.875H4.875a2.437 2.437 0 0 0-2.438 2.438v11.375a2.437 2.437 0 0 0 2.438 2.437h16.25a2.438 2.438 0 0 0 2.438-2.438V7.313a2.438 2.438 0 0 0-2.438-2.437ZM4.062 9.75h17.875v1.625H16.98a1.625 1.625 0 0 0-1.591 1.301 2.438 2.438 0 0 1-4.774 0 1.625 1.625 0 0 0-1.595-1.301H4.063V9.75Zm.813-3.25h16.25a.812.812 0 0 1 .813.813v.812H4.063v-.813a.812.812 0 0 1 .812-.812Zm16.25 13H4.875a.812.812 0 0 1-.813-.813V13H9.02a4.063 4.063 0 0 0 7.961 0h4.957v5.688a.812.812 0 0 1-.812.812Z"
        fill={colors.gray9}
      />
    </Svg>
  );
};
