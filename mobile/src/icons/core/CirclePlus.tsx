import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type CirclePlusProps = ISvgProps;

export const CirclePlus: React.FunctionComponent<CirclePlusProps> = ({
  ...props
}) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={16}
      viewBox="0 0 16 16"
      width={16}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8 0a8 8 0 1 0 8 8 8.008 8.008 0 0 0-8-8Zm0 14.77A6.77 6.77 0 1 1 14.77 8 6.776 6.776 0 0 1 8 14.77ZM11.692 8a.615.615 0 0 1-.615.615H8.615v2.462a.616.616 0 0 1-1.23 0V8.615H4.923a.615.615 0 1 1 0-1.23h2.462V4.923a.615.615 0 1 1 1.23 0v2.462h2.462a.616.616 0 0 1 .615.615Z"
        fill={colors.gray11}
      />
    </Svg>
  );
};
