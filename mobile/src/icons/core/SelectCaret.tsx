import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type SelectCaretProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });

export const SelectCaret: React.FunctionComponent<SelectCaretProps> = ({ className, ...props }) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={16}
      viewBox="0 0 16 16"
      width={16}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <StyledPath
        d="M8 11.75a.763.763 0 0 1-.531-.219l-5-5A.751.751 0 1 1 3.53 5.47L8 9.938l4.468-4.468a.751.751 0 0 1 1.062 1.06l-5 5a.763.763 0 0 1-.53.219Z"
        fill="fill-grey-light-950 dark:fill-grey-dark-950"
        fillOpacity={0.5}
      />
    </StyledSvg>
  );
};
