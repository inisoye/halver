import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type GoogleProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });

export const Google: React.FunctionComponent<GoogleProps> = ({ className, ...otherProps }) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={16}
      viewBox="0 0 16 16"
      width={16}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <G clipPath="url(#a)">
        <Path
          d="M15.63 8.15c0-.656-.054-1.134-.169-1.63H7.976v2.958h4.393c-.088.736-.566 1.843-1.63 2.587l-.014.1 2.366 1.833.164.016c1.506-1.39 2.374-3.437 2.374-5.864Z"
          fill="#4285F4"
        />
        <Path
          d="M7.976 15.945c2.152 0 3.96-.709 5.28-1.931l-2.517-1.949c-.673.47-1.576.797-2.763.797-2.109 0-3.898-1.39-4.536-3.313l-.093.008-2.461 1.905-.032.09a7.967 7.967 0 0 0 7.122 4.393Z"
          fill="#34A853"
        />
        <Path
          d="M3.44 9.55a4.908 4.908 0 0 1-.265-1.577c0-.55.097-1.081.256-1.577l-.004-.106L.935 4.355l-.081.039a7.98 7.98 0 0 0-.85 3.579c0 1.284.31 2.498.85 3.578L3.44 9.55Z"
          fill="#FBBC05"
        />
        <Path
          d="M7.976 3.083c1.497 0 2.507.646 3.082 1.187l2.25-2.197C11.927.788 10.128 0 7.976 0A7.967 7.967 0 0 0 .854 4.394L3.43 6.396c.647-1.923 2.436-3.313 4.545-3.313Z"
          fill="#EB4335"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path d="M0 0h15.64v16H0z" fill="#fff" />
        </ClipPath>
      </Defs>
    </StyledSvg>
  );
};
