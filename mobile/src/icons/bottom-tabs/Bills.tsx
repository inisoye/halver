import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

interface BillsProps extends ISvgProps {
  focused?: boolean;
}

export const Bills: React.FunctionComponent<BillsProps> = ({
  focused,
  ...otherProps
}) => {
  const { colors } = useTheme<Theme>();

  if (focused) {
    return (
      <Svg
        fill="none"
        height={18}
        viewBox="0 0 20 18"
        width={20}
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <Path
          d="M18.25.75H1.75a1.5 1.5 0 0 0-1.5 1.5V16.5a.74.74 0 0 0 .356.637.75.75 0 0 0 .732.038L4 15.835l2.663 1.34a.778.778 0 0 0 .675 0L10 15.835l2.662 1.34a.797.797 0 0 0 .675 0L16 15.835l2.663 1.34a.75.75 0 0 0 .73-.038.74.74 0 0 0 .357-.637V2.25a1.5 1.5 0 0 0-1.5-1.5Zm-3.375 9.75h-9.75a.75.75 0 1 1 0-1.5h9.75a.75.75 0 1 1 0 1.5Zm0-3h-9.75a.75.75 0 0 1 0-1.5h9.75a.75.75 0 1 1 0 1.5Z"
          fill={colors.gray12}
        />
      </Svg>
    );
  }

  return (
    <Svg
      fill="none"
      height={18}
      viewBox="0 0 20 18"
      width={20}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <Path
        d="M4.375 6.75a.75.75 0 0 1 .75-.75h9.75a.75.75 0 1 1 0 1.5h-9.75a.75.75 0 0 1-.75-.75Zm.75 3.75h9.75a.75.75 0 1 0 0-1.5h-9.75a.75.75 0 0 0 0 1.5ZM19.75 2.25V16.5a.74.74 0 0 1-.356.637.751.751 0 0 1-.731.038L16 15.835l-2.662 1.34a.797.797 0 0 1-.675 0L10 15.835l-2.662 1.34a.778.778 0 0 1-.675 0L4 15.835l-2.662 1.34a.75.75 0 0 1-.732-.038.74.74 0 0 1-.356-.637V2.25a1.5 1.5 0 0 1 1.5-1.5h16.5a1.5 1.5 0 0 1 1.5 1.5Zm-1.5 0H1.75v13.04l1.913-.965a.778.778 0 0 1 .675 0L7 15.665l2.663-1.34a.797.797 0 0 1 .675 0L13 15.665l2.662-1.34a.778.778 0 0 1 .675 0l1.913.966V2.25Z"
        fill={colors.gray10}
      />
    </Svg>
  );
};
