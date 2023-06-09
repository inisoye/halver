import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type HalverTinyProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });

export const HalverTiny: React.FunctionComponent<HalverTinyProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={16}
      viewBox="0 0 23 16"
      width={23}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <G clipPath="url(#a)">
        <Path d="M20 0H-3v7.5h23V0Z" fill="#EE8A79" />
        <Path d="M26 8.5H3V16h23V8.5Z" fill="#315D65" />
        <StyledPath
          d="M14.5 16V0"
          stroke="stroke-grey-dark-1000 dark:stroke-grey-light-1000"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path d="M0 0h23v16H0z" fill="#fff" />
        </ClipPath>
      </Defs>
    </StyledSvg>
  );
};
