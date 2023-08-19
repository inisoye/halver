import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { useIsDarkModeSelected } from '@/utils';

type OverdueProps = ISvgProps;

export const Overdue: React.FunctionComponent<OverdueProps> = ({ ...props }) => {
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
        d="M16.25 10.078v3.047H3.75V10a6.25 6.25 0 0 1 6.298-6.25c3.446.026 6.202 2.882 6.202 6.328Z"
        fill="#FF6369"
        fillOpacity={0.2}
      />
      <Path
        d="M9.375 1.25V.625a.625.625 0 0 1 1.25 0v.625a.625.625 0 1 1-1.25 0Zm6.25 2.5a.625.625 0 0 0 .442-.183l.625-.625a.625.625 0 0 0-.884-.884l-.625.625a.625.625 0 0 0 .442 1.067ZM3.933 3.567a.625.625 0 0 0 .884-.884l-.625-.625a.625.625 0 0 0-.884.884l.625.625Zm6.797 2.067a.625.625 0 1 0-.207 1.232c1.482.25 2.602 1.597 2.602 3.134a.624.624 0 1 0 1.25 0c0-2.14-1.568-4.018-3.647-4.366h.002Zm7.395 8.116v1.875a1.25 1.25 0 0 1-1.25 1.25H3.125a1.25 1.25 0 0 1-1.25-1.25V13.75a1.25 1.25 0 0 1 1.25-1.25V10A6.875 6.875 0 0 1 10 3.125h.053c3.762.028 6.823 3.148 6.823 6.953V12.5a1.25 1.25 0 0 1 1.249 1.25ZM4.375 12.5h11.25v-2.422c0-3.125-2.504-5.68-5.582-5.703H10A5.625 5.625 0 0 0 4.375 10v2.5Zm12.5 3.125V13.75H3.125v1.875h13.75Z"
        fill="#FF6369"
        fillOpacity={isDarkMode ? 0.5 : 0.7}
      />
    </Svg>
  );
};
