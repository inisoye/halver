import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type HalverVerticalStackProps = ISvgProps;

export const HalverVerticalStack: React.FunctionComponent<HalverVerticalStackProps> = ({
  ...props
}) => {
  return (
    <Svg
      fill="none"
      height={40}
      viewBox="0 0 8 40"
      width={8}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M0 0h8v20H0z" fill="#EE8A79" />
      <Path d="M0 20h8v20H0z" fill="#315D65" />
    </Svg>
  );
};
