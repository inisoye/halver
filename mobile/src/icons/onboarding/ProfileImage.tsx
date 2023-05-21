import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type ProfileImageProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });

export const ProfileImage: React.FunctionComponent<ProfileImageProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={164}
      viewBox="0 0 164 164"
      width={164}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <StyledPath
        d="M2 82a80.001 80.001 0 0 0 136.569 56.569 80.007 80.007 0 0 0 17.341-87.184A80.002 80.002 0 0 0 82 2 80 80 0 0 0 2 82Z"
        stroke="stroke-grey-light-700 dark:stroke-grey-dark-700"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
      <StyledPath
        d="M30.16 142.88a35.553 35.553 0 0 1 34.062-25.324h35.556a35.552 35.552 0 0 1 34.08 25.377m-78.525-78.71a26.667 26.667 0 1 0 53.334 0 26.667 26.667 0 0 0-53.334 0Z"
        stroke="stroke-grey-light-700 dark:stroke-grey-dark-700"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
    </StyledSvg>
  );
};
