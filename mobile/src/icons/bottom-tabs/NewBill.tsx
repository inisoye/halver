import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type NewBillProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });
const StyledRect = styled(Rect, { classProps: ['fill', 'stroke'] });

export const NewBill: React.FunctionComponent<NewBillProps> = ({ ...otherProps }) => {
  return (
    <StyledSvg
      fill="none"
      height={44}
      viewBox="0 0 44 44"
      width={44}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <StyledRect
        fill="fill-[#F3C1B9] dark:fill-apricot-500"
        height={44}
        rx={8}
        width={44}
      />
      <StyledPath
        d="M34 22a1 1 0 0 1-1 1H23v10a1 1 0 0 1-2 0V23H11a1 1 0 0 1 0-2h10V11a1 1 0 0 1 2 0v10h10a1 1 0 0 1 1 1Z"
        fill="fill-[#844439] dark:fill-grey-dark-50"
      />
    </StyledSvg>
  );
};
