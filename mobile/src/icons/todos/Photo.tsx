import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type AddPhotoProps = ISvgProps;

export const AddPhoto: React.FunctionComponent<AddPhotoProps> = ({
  ...props
}) => {
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
        d="M12.5 8.75a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
        fill={colors.crimson11}
        opacity={0.2}
      />
      <Path
        d="M17.5 3.75v2.188a.625.625 0 1 1-1.25 0V3.75h-2.188a.625.625 0 1 1 0-1.25h2.188a1.25 1.25 0 0 1 1.25 1.25Zm-.625 9.688a.624.624 0 0 0-.625.624v2.188h-2.188a.624.624 0 1 0 0 1.25h2.188a1.25 1.25 0 0 0 1.25-1.25v-2.188a.624.624 0 0 0-.625-.624ZM5.937 16.25H3.75v-2.188a.625.625 0 1 0-1.25 0v2.188a1.25 1.25 0 0 0 1.25 1.25h2.188a.625.625 0 1 0 0-1.25ZM3.126 6.562a.625.625 0 0 0 .625-.625V3.75h2.188a.625.625 0 0 0 0-1.25H3.75A1.25 1.25 0 0 0 2.5 3.75v2.188a.625.625 0 0 0 .625.625ZM13.75 13.75a.624.624 0 0 1-.5-.25 4.061 4.061 0 0 0-6.5 0 .626.626 0 1 1-1-.75 5.308 5.308 0 0 1 2.14-1.694 3.125 3.125 0 1 1 4.215 0 5.3 5.3 0 0 1 2.143 1.693.625.625 0 0 1-.498 1.001ZM10 10.625a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z"
        fill={colors.crimson11}
      />
    </Svg>
  );
};
