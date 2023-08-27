import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { darkColors } from '@/lib/restyle';

type EditPhotoProps = ISvgProps;

export const EditPhoto: React.FunctionComponent<EditPhotoProps> = ({ ...props }) => {
  return (
    <Svg
      fill="none"
      height={28}
      viewBox="0 0 28 28"
      width={28}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M0 6a6 6 0 0 1 6-6h22v20a8 8 0 0 1-8 8H0V6Z" fill={darkColors.gray12} />
      <Path
        d="M21.172 11.307 18.8 13.68 14.32 9.2l2.373-2.372a.64.64 0 0 1 .905 0l3.575 3.572a.64.64 0 0 1 0 .907Z"
        fill={darkColors.gray11}
        opacity={0.2}
      />
      <Path
        d="M21.624 9.95 18.05 6.375a1.28 1.28 0 0 0-1.81 0L6.375 16.24a1.269 1.269 0 0 0-.375.905v3.575A1.28 1.28 0 0 0 7.28 22h3.575a1.27 1.27 0 0 0 .905-.375l9.864-9.865a1.28 1.28 0 0 0 0-1.81Zm-14.08 6.93 6.776-6.775 1.335 1.335-6.775 6.775-1.335-1.335Zm-.264 1.545 2.295 2.295H7.28v-2.295Zm3.84 2.03L9.785 19.12l6.775-6.775 1.335 1.335-6.775 6.775Zm7.68-7.68L15.224 9.2l1.92-1.92 3.574 3.575-1.92 1.92Z"
        fill={darkColors.gray11}
      />
    </Svg>
  );
};
