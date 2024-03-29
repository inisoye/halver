import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { darkColors } from '@/lib/restyle';

type DonationProps = ISvgProps;

export const Donation: React.FunctionComponent<DonationProps> = ({
  ...otherProps
}) => {
  return (
    <Svg
      fill="none"
      height={44}
      viewBox="0 0 55 44"
      width={55}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <Path
        d="M53.073 27.553a4.847 4.847 0 0 0-4.229-.836l-11.688 2.676c.505-.863.77-1.845.77-2.845a5.689 5.689 0 0 0-5.689-5.689H20.371a6.593 6.593 0 0 0-4.693 1.944l-5.642 5.642H2.844A2.844 2.844 0 0 0 0 31.289v9.482a2.844 2.844 0 0 0 2.844 2.844h24.652c.08 0 .16-.009.238-.028l15.17-3.793c.048-.012.096-.028.142-.047l9.202-3.921.052-.024a4.882 4.882 0 0 0 .78-8.249h-.007ZM1.896 40.771v-9.482a.948.948 0 0 1 .948-.948h6.638v11.378H2.844a.948.948 0 0 1-.948-.948Zm49.572-6.678-9.104 3.88L27.38 41.72H11.378V29.786l5.641-5.641a4.705 4.705 0 0 1 3.352-1.39h11.866a3.793 3.793 0 0 1 0 7.586H25.6a.948.948 0 0 0 0 1.896h7.585a.94.94 0 0 0 .214-.023L49.28 28.56h.038a2.987 2.987 0 0 1 2.134 5.542l.016-.01ZM37.926 15.17c.7.002 1.396-.094 2.07-.284a7.586 7.586 0 1 0 5.345-8.908 7.586 7.586 0 1 0-7.415 9.192Zm15.17-1.896a5.69 5.69 0 1 1-11.378 0 5.69 5.69 0 0 1 11.379 0ZM37.927 1.896a5.69 5.69 0 0 1 5.627 4.85 7.585 7.585 0 0 0-3.73 6.201 5.69 5.69 0 1 1-1.897-11.05Z"
        fill={darkColors.gray3}
      />
    </Svg>
  );
};
