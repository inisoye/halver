import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';
import { useIsDarkMode } from '@/utils';

type VerveProps = ISvgProps;

export const Verve: React.FunctionComponent<VerveProps> = ({ ...props }) => {
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
      <G clipPath="url(#a)" clipRule="evenodd" fillRule="evenodd">
        <Path
          d="M13.964 12.503a4.448 4.448 0 1 1-8.895 0 4.448 4.448 0 0 1 8.895 0Z"
          fill="#ED342B"
        />
        <Path
          d="M9.516 14.409c-.995-2.256-1.724-4.362-1.724-4.362H6.267s.928 2.704 2.652 6.085h1.194c1.724-3.381 2.652-6.085 2.652-6.085H11.24s-.73 2.106-1.724 4.361Z"
          fill="#FEFEFE"
        />
        <Path
          d="M28.67 12.271c-.862 0-.928.929-.928.929h1.856s-.066-.929-.928-.929Zm2.056 1.857h-2.984s.066.995 1.392.995c.663 0 1.327-.2 1.327-.2l.132 1.062s-.663.265-1.591.265c-1.326 0-2.52-.663-2.52-2.52 0-1.459.928-2.387 2.255-2.387 1.989 0 2.121 1.99 1.989 2.785Zm-10.147-1.567.206-1.095s-1.586-.48-2.874.41v4.38h1.368v-3.558c.547-.41 1.3-.137 1.3-.137Zm-5.704-.29c-.862 0-.928.929-.928.929h1.856s-.066-.929-.928-.929Zm2.055 1.857h-2.983s.066.995 1.392.995c.663 0 1.326-.2 1.326-.2l.133 1.062s-.663.265-1.592.265c-1.326 0-2.52-.663-2.52-2.52 0-1.459.929-2.387 2.255-2.387 1.99 0 2.122 1.99 1.99 2.785Zm6.99.454a21.508 21.508 0 0 1-1.043-3.238h-1.39s.695 2.683 1.877 4.905h1.11c1.182-2.222 1.877-4.905 1.877-4.905h-1.39s-.347 1.57-1.042 3.239Z"
          fill="#03435F"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path d="M5 8h25.826v9H5z" fill="#fff" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
