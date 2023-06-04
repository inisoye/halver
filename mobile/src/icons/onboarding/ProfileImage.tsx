import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type ProfileImageProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });
const StyledRect = styled(Rect, { classProps: ['fill', 'stroke'] });

export const ProfileImage: React.FunctionComponent<ProfileImageProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <>
      <StyledSvg
        className={className}
        fill="none"
        height={160}
        viewBox="0 0 160 160"
        width={160}
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <StyledRect
          height={157}
          rx={14.5}
          stroke="stroke-grey-light-700 dark:stroke-grey-dark-700"
          strokeWidth={3}
          width={157}
          x={1.5}
          y={1.5}
        />
        <StyledPath
          d="M28 158.324A35.557 35.557 0 0 1 62.062 133h35.556a35.559 35.559 0 0 1 34.08 25.378M53.173 79.667a26.667 26.667 0 1 0 53.334 0 26.667 26.667 0 0 0-53.334 0Z"
          stroke="stroke-grey-light-700 dark:stroke-grey-dark-700"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
        />
      </StyledSvg>
    </>
  );
};
