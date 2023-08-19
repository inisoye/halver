import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';
import { useIsDarkModeSelected } from '@/utils';

type NewBillProps = ISvgProps;

export const NewBill: React.FunctionComponent<NewBillProps> = ({ ...props }) => {
  const isDarkMode = useIsDarkModeSelected();
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={40}
      viewBox="0 0 40 40"
      width={40}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        fill={isDarkMode ? colors.apricot6 : colors.apricot7}
        height={40}
        rx={8}
        width={40}
      />
      <Path
        d="M31.666 20a.972.972 0 0 1-.972.972h-9.722v9.722a.972.972 0 1 1-1.945 0v-9.722H9.306a.972.972 0 1 1 0-1.944h9.723V9.305a.972.972 0 1 1 1.944 0v9.723h9.722a.972.972 0 0 1 .972.972Z"
        fill={colors.gray1}
      />
    </Svg>
  );
};
