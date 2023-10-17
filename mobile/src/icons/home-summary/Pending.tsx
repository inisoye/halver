import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { useIsDarkModeSelected } from '@/utils';

type PendingProps = ISvgProps;

export const Pending: React.FunctionComponent<PendingProps> = ({
  ...props
}) => {
  const isDarkMode = useIsDarkModeSelected();

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
        d="M15 14.375v2.5a.624.624 0 0 1-.625.625h-8.75A.625.625 0 0 1 5 16.875v-2.5h10Z"
        fill="#FF8B3E"
        fillOpacity={0.2}
      />
      <Path
        d="M15.625 5.91V3.124a1.25 1.25 0 0 0-1.25-1.25h-8.75a1.25 1.25 0 0 0-1.25 1.25v2.813a1.255 1.255 0 0 0 .5 1L8.959 10l-4.084 3.063a1.255 1.255 0 0 0-.5 1v2.812a1.25 1.25 0 0 0 1.25 1.25h8.75a1.25 1.25 0 0 0 1.25-1.25v-2.784a1.255 1.255 0 0 0-.496-.997L11.037 10l4.092-3.093a1.257 1.257 0 0 0 .496-.998Zm-1.7 7.84H6.04L10 10.781l3.924 2.969Zm-8.3 3.125V15h8.75v1.875h-8.75Zm8.75-10.966L10 9.22 5.625 5.938V3.124h8.75v2.784Z"
        fill="#FF8B3E"
        fillOpacity={isDarkMode ? 0.5 : 0.7}
      />
    </Svg>
  );
};
