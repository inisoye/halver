import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { useIsDarkModeSelected } from '@/utils';

type RecurringProps = ISvgProps;

export const Recurring: React.FunctionComponent<RecurringProps> = ({ ...props }) => {
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
        d="M17.5 5v5a5 5 0 0 1-5 5h-10v-5a5 5 0 0 1 5-5h10Z"
        fill="#4CC38A"
        fillOpacity={0.2}
      />
      <Path
        d="M1.875 10A5.631 5.631 0 0 1 7.5 4.375h8.49l-.808-.808a.626.626 0 0 1 .885-.884l1.875 1.875a.626.626 0 0 1 0 .884l-1.875 1.875a.625.625 0 0 1-.885-.884l.809-.808H7.5A4.38 4.38 0 0 0 3.125 10a.625.625 0 0 1-1.25 0ZM17.5 9.375a.625.625 0 0 0-.625.625 4.38 4.38 0 0 1-4.376 4.375H4.01l.808-.808a.626.626 0 0 0-.885-.884l-1.875 1.875a.625.625 0 0 0 0 .884l1.875 1.875a.626.626 0 0 0 .885-.884l-.809-.808H12.5A5.632 5.632 0 0 0 18.125 10a.625.625 0 0 0-.625-.625Z"
        fill="#4CC38A"
        fillOpacity={isDarkMode ? 0.5 : 0.7}
      />
    </Svg>
  );
};
