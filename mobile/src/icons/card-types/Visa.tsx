import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';
import { useIsDarkMode } from '@/utils';

type VisaProps = ISvgProps;

export const Visa: React.FunctionComponent<VisaProps> = ({ ...props }) => {
  const isDarkMode = useIsDarkMode();
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={24}
      viewBox="0 0 37 24"
      width={37}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        fill={isDarkMode ? colors.gray12 : colors.gray6}
        height={24}
        rx={4}
        width={36.67}
      />
      <G clipPath="url(#a)">
        <Path
          d="M18.761 10.547c-.014 1.11.99 1.73 1.745 2.098.777.378 1.037.62 1.034.958-.005.517-.619.745-1.193.754-1.002.016-1.584-.27-2.047-.486l-.361 1.688c.464.214 1.325.4 2.217.409 2.094 0 3.463-1.034 3.47-2.636.01-2.034-2.812-2.147-2.793-3.056.007-.275.27-.57.846-.644.285-.038 1.073-.067 1.966.344l.35-1.634A5.345 5.345 0 0 0 22.13 8c-1.97 0-3.357 1.048-3.368 2.547Zm8.602-2.406a.909.909 0 0 0-.849.565l-2.99 7.142h2.092l.416-1.15h2.557l.242 1.15h1.844l-1.61-7.707h-1.702Zm.292 2.082.604 2.894h-1.654l1.05-2.894ZM16.225 8.14l-1.65 7.707h1.994l1.648-7.707h-1.993m-2.95 0L11.2 13.387l-.84-4.46c-.098-.499-.487-.786-.919-.786H6.048L6 8.365c.696.15 1.488.394 1.967.655.294.16.377.299.474.677l1.59 6.151h2.107l3.23-7.707h-2.094"
          fill="url(#b)"
        />
      </G>
      <Defs>
        <LinearGradient
          gradientUnits="userSpaceOnUse"
          id="b"
          x1={17.344}
          x2={17.575}
          y1={16.128}
          y2={7.945}
        >
          <Stop stopColor="#222357" />
          <Stop offset={1} stopColor="#254AA5" />
        </LinearGradient>
        <ClipPath id="a">
          <Path d="M6 8h24.675v8H6z" fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
