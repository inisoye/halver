import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';
import { useIsDarkMode } from '@/utils';

type NewBillSmallProps = ISvgProps;

export const NewBillSmall: React.FunctionComponent<NewBillSmallProps> = ({
  ...props
}) => {
  const isDarkMode = useIsDarkMode();
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={36}
      viewBox="0 0 36 36"
      width={36}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G opacity={0.2}>
        <Path d="M30.375 6.75v22.5a1.125 1.125 0 0 1-1.125 1.125H6.75a1.125 1.125 0 0 1-1.125-1.125V6.75A1.125 1.125 0 0 1 6.75 5.625h22.5a1.125 1.125 0 0 1 1.125 1.125Z" />
        <Path
          d="M30.375 6.75v22.5a1.125 1.125 0 0 1-1.125 1.125H6.75a1.125 1.125 0 0 1-1.125-1.125V6.75A1.125 1.125 0 0 1 6.75 5.625h22.5a1.125 1.125 0 0 1 1.125 1.125Z"
          fill={colors.apricot6}
          fillOpacity={isDarkMode ? 0.7 : 1}
        />
      </G>
      <Path d="M31.5 18a1.125 1.125 0 0 1-1.125 1.125h-11.25v11.25a1.125 1.125 0 1 1-2.25 0v-11.25H5.625a1.125 1.125 0 1 1 0-2.25h11.25V5.625a1.125 1.125 0 1 1 2.25 0v11.25h11.25A1.125 1.125 0 0 1 31.5 18Z" />
      <Path
        d="M31.5 18a1.125 1.125 0 0 1-1.125 1.125h-11.25v11.25a1.125 1.125 0 1 1-2.25 0v-11.25H5.625a1.125 1.125 0 1 1 0-2.25h11.25V5.625a1.125 1.125 0 1 1 2.25 0v11.25h11.25A1.125 1.125 0 0 1 31.5 18Z"
        fill={colors.apricot6}
        fillOpacity={isDarkMode ? 0.7 : 1}
      />
    </Svg>
  );
};
