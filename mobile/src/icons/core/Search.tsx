import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type SearchProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });

export const Search: React.FunctionComponent<SearchProps> = ({ className, ...props }) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={20}
      viewBox="0 0 20 20"
      width={20}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <StyledPath
        d="m17.945 17.055-3.383-3.375a7.203 7.203 0 1 0-.882.883l3.375 3.382a.64.64 0 0 0 .89 0 .633.633 0 0 0 0-.89ZM3.125 9.063A5.938 5.938 0 1 1 9.063 15a5.946 5.946 0 0 1-5.938-5.938Z"
        fill="fill-grey-light-800 dark:fill-grey-dark-800"
      />
    </StyledSvg>
  );
};
