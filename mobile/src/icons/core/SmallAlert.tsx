import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type SmallAlertProps = ISvgProps;

export const SmallAlert: React.FunctionComponent<SmallAlertProps> = ({
  ...props
}) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={13}
      viewBox="0 0 13 13"
      width={13}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#a)">
        <Path
          d="M6.467 1.083a1.62 1.62 0 0 1 1.328.693l.058.089 4.567 7.623a1.62 1.62 0 0 1-1.282 2.424l-.108.005H1.9A1.62 1.62 0 0 1 .465 9.583l.055-.102 4.563-7.619a1.62 1.62 0 0 1 1.384-.779Zm.038 7.584-.068.004a.542.542 0 0 0 0 1.075l.063.004.069-.004a.542.542 0 0 0 0-1.075l-.064-.004ZM6.5 4.333a.542.542 0 0 0-.538.479l-.004.063v2.167l.004.063a.542.542 0 0 0 1.076 0l.004-.063V4.875l-.004-.063a.542.542 0 0 0-.538-.479Z"
          fill={colors.gray1}
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path d="M0 0h13v13H0z" fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
