import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type CoinProps = ISvgProps;

export const Coin: React.FunctionComponent<CoinProps> = ({ ...props }) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={24}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M21.75 9.75c0 2.25-3.75 4.5-9.75 4.5S2.25 12 2.25 9.75 6 5.25 12 5.25s9.75 2.25 9.75 4.5Z"
        fill={colors.gray11}
        opacity={0.2}
      />
      <Path
        d="M19.46 5.985C17.518 5.014 14.938 4.5 12 4.5c-2.937 0-5.517.514-7.46 1.485C2.595 6.956 1.5 8.323 1.5 9.75v4.5c0 1.427 1.108 2.798 3.04 3.765C6.47 18.982 9.062 19.5 12 19.5c2.937 0 5.517-.514 7.46-1.485 1.944-.971 3.04-2.338 3.04-3.765v-4.5c0-1.427-1.108-2.798-3.04-3.765ZM12 6c5.872 0 9 2.178 9 3.75s-3.128 3.75-9 3.75-9-2.178-9-3.75S6.128 6 12 6Zm-.75 8.987v3c-1.781-.058-3.281-.32-4.5-.702v-2.937c1.47.392 2.98.606 4.5.639Zm1.5 0a19.07 19.07 0 0 0 4.5-.639v2.936c-1.219.381-2.719.644-4.5.702v-3ZM3 14.25v-1.732c.472.392.989.727 1.54.997.227.113.468.22.71.322v2.85C3.766 15.953 3 15.027 3 14.25Zm15.75 2.438v-2.851c.245-.102.483-.209.71-.322a7.77 7.77 0 0 0 1.54-.997v1.732c0 .777-.766 1.703-2.25 2.438Z"
        fill={colors.gray11}
      />
    </Svg>
  );
};
