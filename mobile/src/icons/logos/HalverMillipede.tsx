import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';
import { useIsDarkMode } from '@/utils';

type HalverMillipedeProps = ISvgProps;

export const HalverMillipede: React.FunctionComponent<HalverMillipedeProps> = ({
  ...otherProps
}) => {
  const isDarkMode = useIsDarkMode();
  const { colors } = useTheme<Theme>();

  return (
    <>
      <Svg
        fill="none"
        height={12}
        viewBox="0 0 654 12"
        width={654}
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <Rect
          fill={isDarkMode ? colors.pharlap8 : colors.pharlap5}
          height={12}
          rx={3}
          width={40}
        />
        <Rect
          fill={isDarkMode ? colors.goldDrop6 : colors.goldDrop5}
          height={12}
          rx={3}
          width={40}
          x={20}
        />
        <Rect
          fill={isDarkMode ? colors.casal7 : colors.casal6}
          height={12}
          rx={3}
          width={40}
          x={40}
        />
        <Rect
          fill={isDarkMode ? colors.apricot6 : colors.apricot5}
          height={12}
          rx={3}
          width={40}
          x={60}
        />
        <Rect
          fill={isDarkMode ? colors.pharlap8 : colors.pharlap5}
          height={12}
          rx={3}
          width={40}
          x={80}
        />
        <Rect
          fill={isDarkMode ? colors.goldDrop6 : colors.goldDrop5}
          height={12}
          rx={3}
          width={40}
          x={100}
        />
        <Rect
          fill={isDarkMode ? colors.casal7 : colors.casal6}
          height={12}
          rx={3}
          width={40}
          x={120}
        />
        <Rect
          fill={isDarkMode ? colors.apricot6 : colors.apricot5}
          height={12}
          rx={3}
          width={40}
          x={140}
        />
        <Rect
          fill={isDarkMode ? colors.pharlap8 : colors.pharlap5}
          height={12}
          rx={3}
          width={40}
          x={157}
        />
        <Rect
          fill={isDarkMode ? colors.goldDrop6 : colors.goldDrop5}
          height={12}
          rx={3}
          width={40}
          x={177}
        />
        <Rect
          fill={isDarkMode ? colors.casal7 : colors.casal6}
          height={12}
          rx={3}
          width={40}
          x={197}
        />
        <Rect
          fill={isDarkMode ? colors.apricot6 : colors.apricot5}
          height={12}
          rx={3}
          width={40}
          x={217}
        />
        <Rect
          fill={isDarkMode ? colors.pharlap8 : colors.pharlap5}
          height={12}
          rx={3}
          width={40}
          x={237}
        />
        <Rect
          fill={isDarkMode ? colors.goldDrop6 : colors.goldDrop5}
          height={12}
          rx={3}
          width={40}
          x={257}
        />
        <Rect
          fill={isDarkMode ? colors.casal7 : colors.casal6}
          height={12}
          rx={3}
          width={40}
          x={277}
        />
        <Rect
          fill={isDarkMode ? colors.apricot6 : colors.apricot5}
          height={12}
          rx={3}
          width={40}
          x={297}
        />
        <Rect
          fill={isDarkMode ? colors.pharlap8 : colors.pharlap5}
          height={12}
          rx={3}
          width={40}
          x={317}
        />
        <Rect
          fill={isDarkMode ? colors.goldDrop6 : colors.goldDrop5}
          height={12}
          rx={3}
          width={40}
          x={337}
        />
        <Rect
          fill={isDarkMode ? colors.casal7 : colors.casal6}
          height={12}
          rx={3}
          width={40}
          x={357}
        />
        <Rect
          fill={isDarkMode ? colors.apricot6 : colors.apricot5}
          height={12}
          rx={3}
          width={40}
          x={377}
        />
        <Rect
          fill={isDarkMode ? colors.pharlap8 : colors.pharlap5}
          height={12}
          rx={3}
          width={40}
          x={397}
        />
        <Rect
          fill={isDarkMode ? colors.goldDrop6 : colors.goldDrop5}
          height={12}
          rx={3}
          width={40}
          x={417}
        />
        <Rect
          fill={isDarkMode ? colors.casal7 : colors.casal6}
          height={12}
          rx={3}
          width={40}
          x={437}
        />
        <Rect
          fill={isDarkMode ? colors.apricot6 : colors.apricot5}
          height={12}
          rx={3}
          width={40}
          x={457}
        />
        <Rect
          fill={isDarkMode ? colors.pharlap8 : colors.pharlap5}
          height={12}
          rx={3}
          width={40}
          x={477}
        />
        <Rect
          fill={isDarkMode ? colors.goldDrop6 : colors.goldDrop5}
          height={12}
          rx={3}
          width={40}
          x={497}
        />
        <Rect
          fill={isDarkMode ? colors.casal7 : colors.casal6}
          height={12}
          rx={3}
          width={40}
          x={517}
        />
        <Rect
          fill={isDarkMode ? colors.apricot6 : colors.apricot5}
          height={12}
          rx={3}
          width={40}
          x={537}
        />
        <Rect
          fill={isDarkMode ? colors.pharlap8 : colors.pharlap5}
          height={12}
          rx={3}
          width={40}
          x={554}
        />
        <Rect
          fill={isDarkMode ? colors.goldDrop6 : colors.goldDrop5}
          height={12}
          rx={3}
          width={40}
          x={574}
        />
        <Rect
          fill={isDarkMode ? colors.casal7 : colors.casal6}
          height={12}
          rx={3}
          width={40}
          x={594}
        />
        <Rect
          fill={isDarkMode ? colors.apricot6 : colors.apricot5}
          height={12}
          rx={3}
          width={40}
          x={614}
        />
      </Svg>
    </>
  );
};
