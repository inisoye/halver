import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

import { Theme } from '@/lib/restyle';

type SuccessTickProps = ISvgProps;

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    right: -40,
    bottom: -4,
  },
});

export const SuccessTick: React.FunctionComponent<SuccessTickProps> = ({
  ...props
}) => {
  const { colors } = useTheme<Theme>();

  return (
    <Svg
      fill="none"
      height={120}
      style={styles.icon}
      viewBox="0 0 120 120"
      width={120}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="m111.403 39.966-60.188 60.187a3.748 3.748 0 0 1-5.306 0l-33.563-33.75a3.75 3.75 0 0 1 0-5.301l11.25-11.25a3.75 3.75 0 0 1 5.307 0l17.194 16.556a3.75 3.75 0 0 0 5.306 0l43.444-42.806a3.75 3.75 0 0 1 5.306 0l11.25 11.062a3.753 3.753 0 0 1 0 5.302Z"
        fill={colors.green8}
        opacity={0.2}
      />
      <Path
        d="m114.037 31.988-11.25-11.044a7.498 7.498 0 0 0-10.584 0L48.75 63.75l-.052-.051-17.175-16.533a7.5 7.5 0 0 0-10.58.028l-11.25 11.25a7.5 7.5 0 0 0 0 10.598l33.572 33.75a7.493 7.493 0 0 0 5.304 2.198 7.493 7.493 0 0 0 5.304-2.198l60.188-60.178a7.504 7.504 0 0 0 1.615-8.193 7.506 7.506 0 0 0-1.639-2.433ZM48.572 97.5 15 63.75 26.25 52.5l.051.052 17.175 16.532a7.5 7.5 0 0 0 10.557 0L97.528 26.25l11.222 11.063L48.572 97.5Z"
        fill={colors.green8}
      />
    </Svg>
  );
};
