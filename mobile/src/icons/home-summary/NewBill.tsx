import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type NewBillSmallProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });

export const NewBillSmall: React.FunctionComponent<NewBillSmallProps> = ({
  className,
  ...props
}) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={36}
      viewBox="0 0 36 36"
      width={36}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G opacity={0.2}>
        <StyledPath
          d="M30.375 6.75v22.5a1.125 1.125 0 0 1-1.125 1.125H6.75a1.125 1.125 0 0 1-1.125-1.125V6.75A1.125 1.125 0 0 1 6.75 5.625h22.5a1.125 1.125 0 0 1 1.125 1.125Z"
          fill="fill-light-50 dark:fill-dark-50"
        />
        <StyledPath
          d="M30.375 6.75v22.5a1.125 1.125 0 0 1-1.125 1.125H6.75a1.125 1.125 0 0 1-1.125-1.125V6.75A1.125 1.125 0 0 1 6.75 5.625h22.5a1.125 1.125 0 0 1 1.125 1.125Z"
          fill="fill-apricot-500 dark:opacity-70"
        />
      </G>
      <StyledPath
        d="M31.5 18a1.125 1.125 0 0 1-1.125 1.125h-11.25v11.25a1.125 1.125 0 1 1-2.25 0v-11.25H5.625a1.125 1.125 0 1 1 0-2.25h11.25V5.625a1.125 1.125 0 1 1 2.25 0v11.25h11.25A1.125 1.125 0 0 1 31.5 18Z"
        fill="fill-light-50 dark:fill-dark-50"
      />
      <StyledPath
        d="M31.5 18a1.125 1.125 0 0 1-1.125 1.125h-11.25v11.25a1.125 1.125 0 1 1-2.25 0v-11.25H5.625a1.125 1.125 0 1 1 0-2.25h11.25V5.625a1.125 1.125 0 1 1 2.25 0v11.25h11.25A1.125 1.125 0 0 1 31.5 18Z"
        fill="fill-apricot-500 dark:opacity-70"
      />
    </StyledSvg>
  );
};
