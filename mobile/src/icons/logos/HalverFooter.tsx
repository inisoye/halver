import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type HalverFooterProps = ISvgProps;

export const HalverFooter: React.FunctionComponent<HalverFooterProps> = ({
  ...otherProps
}) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={29}
      viewBox="0 0 98 29"
      width={98}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <G clipPath="url(#a)">
        <Path d="M94 5H65.25v9.375H94V5Z" fill="#EE8A79" />
        <Path d="M101.5 15.625H72.75V25h28.75v-9.375Z" fill="#315D65" />
        <Path d="M87.125 25V5" stroke={colors.gray1} strokeWidth={1.25} />
      </G>
      <Path
        d="M1.704 5.72V23h2.28v-6.528c0-2.328 1.056-3.576 2.904-3.576 1.848 0 2.76 1.2 2.76 3.456V23h2.376v-6.936c0-3.456-1.848-5.232-4.536-5.232-1.464 0-2.712.552-3.504 1.488v-6.6h-2.28ZM21.418 23h2.088v-8.064c0-2.448-1.608-4.104-4.608-4.104-2.544 0-4.416 1.248-5.016 3.36l2.016.72c.36-1.344 1.44-2.04 2.904-2.04 1.584 0 2.424.816 2.424 1.848v.936l-3.408.384c-2.88.312-4.392 1.728-4.392 3.744 0 2.04 1.536 3.36 4.104 3.36 1.848 0 2.952-.696 3.696-1.896L21.418 23Zm-.192-5.496v.264c0 2.064-1.128 3.456-3.432 3.456-1.248 0-1.968-.648-1.968-1.56 0-.936.72-1.584 2.112-1.752l3.288-.408ZM25.554 5.72V23h2.28V5.72h-2.28ZM31.345 11h-2.424l4.632 12h2.448l4.68-12h-2.4l-3.48 9.576L31.345 11Zm15.416 12.168c2.376 0 4.32-1.152 5.28-3.096l-1.968-.696c-.48 1.056-1.752 1.728-3.312 1.728-1.896 0-3.264-1.32-3.432-3.24h8.88a8.31 8.31 0 0 0 .096-1.248c.048-3.408-2.328-5.784-5.688-5.784-3.336 0-5.76 2.568-5.76 6.072 0 3.672 2.448 6.264 5.904 6.264Zm3.072-7.248h-6.48c.264-1.776 1.608-3.048 3.24-3.048 1.848 0 3.216 1.296 3.24 3.048Zm4.02-4.92v12h2.28v-6.216c0-2.856 2.087-4.176 4.175-3.648V11c-1.656-.36-3.216.36-4.224 1.608L55.94 11h-2.088Z"
        fill={colors.gray12}
      />
      <Defs>
        <ClipPath id="a">
          <Path d="M69 5h28.75v20H69z" fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
