import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type EditPencilProps = ISvgProps;

export const EditPencil: React.FunctionComponent<EditPencilProps> = ({
  ...props
}) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={12}
      viewBox="0 0 12 12"
      width={12}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M11.38 3.98 9.6 5.76 6.24 2.4 8.02.62a.48.48 0 0 1 .678 0L11.38 3.3a.48.48 0 0 1 0 .68Z"
        fill={colors.gray11}
        opacity={0.2}
      />
      <Path
        d="M11.719 2.963 9.038.28a.96.96 0 0 0-1.358 0L.281 7.68A.952.952 0 0 0 0 8.358v2.681a.96.96 0 0 0 .96.96h2.681a.952.952 0 0 0 .68-.281l7.398-7.399a.96.96 0 0 0 0-1.357ZM1.159 8.16 6.24 3.08l1.001 1L2.16 9.16l-1.001-1ZM.96 9.32l1.721 1.721H.96V9.319Zm2.88 1.522-1.001-1L7.92 4.758 8.922 5.76 3.84 10.841Zm5.76-5.76-2.68-2.68L8.359.96l2.681 2.68L9.6 5.08Z"
        fill={colors.gray11}
      />
    </Svg>
  );
};
