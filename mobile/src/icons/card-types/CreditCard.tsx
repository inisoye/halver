import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';
import { useIsDarkModeSelected } from '@/utils';

type CreditCardProps = ISvgProps;

export const CreditCard: React.FunctionComponent<CreditCardProps> = ({
  ...props
}) => {
  const isDarkMode = useIsDarkModeSelected();
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={24}
      viewBox="0 0 37 24"
      width={37}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        fill={isDarkMode ? colors.gray12 : colors.gray6}
        height={24}
        rx={4}
        width={36.67}
      />
      <Path
        d="M11.154 5A2.154 2.154 0 0 0 9 7.154v9.692A2.154 2.154 0 0 0 11.154 19H26.23a2.154 2.154 0 0 0 2.154-2.154V7.154S28.385 5 26.23 5H11.154Z"
        fill="#FFAC33"
      />
      <Path d="M9 7.692h19.385v2.693H9V7.692Z" fill="#292F33" />
      <Path d="M11.154 12.539H26.23v3.23H11.154v-3.23Z" fill="#F4F7F9" />
      <Path
        d="M19.23 15.23c-.916 0-1.26-.65-1.329-.969-.294.022-.581.163-.972.411-.412.262-.878.559-1.467.559-.645 0-1.037-.364-1.078-1.077-.001-.03.021-.101.012-.101-1 0-1.724.948-1.731.957a.536.536 0 0 1-.894-.039.54.54 0 0 1 .026-.598c.041-.056 1.031-1.296 2.587-1.296 1.043 0 1.103.74 1.12 1.017l.003.058c.262-.018.534-.19.846-.39.517-.328 1.159-.737 2.019-.517.469.12.542.555.57.72.007.04.017.102.026.121.004 0 .08.049.311.07.442.04.927-.15 1.44-.352.532-.209 1.083-.424 1.676-.424 1.825 0 2.567.88 2.645.98a.539.539 0 1 1-.848.664c-.013-.015-.5-.568-1.797-.568-.39 0-.822.17-1.282.35-.543.213-1.31.425-1.882.425Z"
        fill="#8899A6"
      />
    </Svg>
  );
};
