import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type CloseModalProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });
const StyledCircle = styled(Circle, { classProps: ['fill', 'stroke'] });

export const CloseModal: React.FunctionComponent<CloseModalProps> = ({ className, ...props }) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={40}
      viewBox="0 0 40 40"
      width={40}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <StyledCircle cx={20} cy={20} fill="fill-grey-light-300 dark:fill-grey-dark-300" r={20} />
      <StyledPath
        d="M26.289 24.961a.938.938 0 0 1-.664 1.6.945.945 0 0 1-.664-.272L20 21.33l-4.961 4.96a.945.945 0 0 1-1.532-.304.938.938 0 0 1 .204-1.024L18.67 20l-4.96-4.96a.94.94 0 1 1 1.328-1.329l4.96 4.96 4.962-4.96a.94.94 0 1 1 1.328 1.328L21.328 20l4.96 4.961Z"
        fill="fill-grey-light-950 dark:fill-grey-dark-1000"
      />
    </StyledSvg>
  );
};
