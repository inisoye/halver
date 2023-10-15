import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type EnableNotificationsProps = ISvgProps;

export const EnableNotifications: React.FunctionComponent<
  EnableNotificationsProps
> = ({ ...props }) => {
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
        d="M16.25 15H3.75a.626.626 0 0 1-.537-.938c.514-.89 1.162-3.14 1.162-5.937a5.625 5.625 0 0 1 11.25 0c0 2.798.649 5.047 1.164 5.938a.625.625 0 0 1-.539.937Z"
        fill={colors.brown11}
        opacity={0.2}
      />
      <Path
        d="M13.125 17.5a.625.625 0 0 1-.625.625h-5a.625.625 0 1 1 0-1.25h5a.625.625 0 0 1 .625.625Zm4.207-2.5a1.234 1.234 0 0 1-1.082.625H3.75a1.25 1.25 0 0 1-1.078-1.88c.434-.747 1.078-2.86 1.078-5.62a6.25 6.25 0 0 1 12.5 0c0 2.76.646 4.873 1.08 5.62A1.241 1.241 0 0 1 17.331 15Zm-1.082-.625c-.604-1.037-1.25-3.434-1.25-6.25a5 5 0 0 0-10 0c0 2.817-.647 5.214-1.25 6.25h12.5Z"
        fill={colors.brown11}
      />
    </Svg>
  );
};
