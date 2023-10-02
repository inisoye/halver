import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type ShareArrowProps = ISvgProps;

export const ShareArrow: React.FunctionComponent<ShareArrowProps> = ({
  ...props
}) => {
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
        d="m22.28 9.97-7.5-7.5A.75.75 0 0 0 13.5 3v3.783c-2.432.208-5.118 1.399-7.328 3.273-2.66 2.257-4.317 5.166-4.665 8.19a1.125 1.125 0 0 0 1.94.899c1.03-1.098 4.7-4.57 10.053-4.875V18a.75.75 0 0 0 1.28.53l7.5-7.5a.75.75 0 0 0 0-1.06ZM15 16.19V13.5a.75.75 0 0 0-.75-.75c-2.633 0-5.197.687-7.621 2.044a18.388 18.388 0 0 0-3.428 2.486c.543-2.235 1.914-4.36 3.942-6.08 2.177-1.847 4.833-2.95 7.107-2.95A.75.75 0 0 0 15 7.5V4.811l5.69 5.689L15 16.19Z"
        fill={colors.gray12}
      />
    </Svg>
  );
};
