import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

interface TransactionsProps extends ISvgProps {
  focused?: boolean;
}

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });

export const Transactions: React.FunctionComponent<TransactionsProps> = ({
  focused,
  ...otherProps
}) => {
  if (focused) {
    return (
      <StyledSvg
        fill="none"
        height={19}
        viewBox="0 0 25 19"
        width={25}
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <StyledPath
          d="M17.969 5.747v-.544c0-2.45-3.695-4.297-8.594-4.297-4.9 0-8.594 1.848-8.594 4.297V9.11c0 2.04 2.564 3.662 6.25 4.147v.54c0 2.45 3.695 4.298 8.594 4.298 4.9 0 8.594-1.848 8.594-4.297V9.89c0-2.022-2.483-3.645-6.25-4.144Zm-12.5 5.596c-1.913-.534-3.125-1.414-3.125-2.234V7.735c.797.565 1.864 1.02 3.125 1.326v2.282ZM13.28 9.06c1.261-.306 2.328-.761 3.125-1.326V9.11c0 .82-1.212 1.7-3.125 2.234V9.06Zm-1.562 6.97c-1.913-.535-3.125-1.415-3.125-2.234v-.407a18.793 18.793 0 0 0 1.894-.018c.403.145.814.267 1.23.367v2.291Zm0-4.358c-.776.114-1.56.172-2.344.17a15.93 15.93 0 0 1-2.344-.17V9.35c.777.1 1.56.151 2.344.15.784.001 1.567-.05 2.344-.15v2.323Zm6.25 4.687a16.162 16.162 0 0 1-4.688 0V14.03a17.939 17.939 0 0 0 4.688.006v2.323Zm4.687-2.563c0 .82-1.212 1.7-3.125 2.233v-2.282c1.261-.306 2.328-.76 3.125-1.325v1.374Z"
          fill="fill-grey-light-1000 dark:fill-grey-dark-1000"
        />
      </StyledSvg>
    );
  }

  return (
    <StyledSvg
      fill="none"
      height={19}
      width={25}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <StyledPath
        d="M17.969 5.75v-.547c0-2.451-3.692-4.297-8.594-4.297C4.473.906.781 2.752.781 5.203V9.11c0 2.041 2.559 3.662 6.25 4.15v.538c0 2.451 3.692 4.297 8.594 4.297 4.902 0 8.594-1.846 8.594-4.297V9.89c0-2.022-2.48-3.643-6.25-4.141Zm4.687 4.14c0 1.29-3.008 2.735-7.031 2.735a13.4 13.4 0 0 1-1.084-.04c2.11-.76 3.428-2.01 3.428-3.476V7.322c2.92.44 4.687 1.621 4.687 2.569ZM7.031 11.669V9.354c.777.1 1.56.148 2.344.146a17.97 17.97 0 0 0 2.344-.146v2.314c-.776.12-1.56.18-2.344.176a14.76 14.76 0 0 1-2.344-.176Zm9.375-3.936V9.11c0 .82-1.21 1.7-3.125 2.237V9.06c1.26-.303 2.324-.762 3.125-1.329ZM9.375 2.47c4.023 0 7.031 1.445 7.031 2.734 0 1.29-3.008 2.734-7.031 2.734S2.344 6.492 2.344 5.204 5.352 2.47 9.375 2.47ZM2.344 9.11V7.732c.8.567 1.865 1.026 3.125 1.329v2.285c-1.914-.537-3.125-1.416-3.125-2.237Zm6.25 4.688v-.41l.781.02c.384 0 .755-.01 1.113-.03.39.137.801.254 1.23.361v2.295c-1.913-.537-3.124-1.416-3.124-2.236Zm4.687 2.558v-2.324a18.37 18.37 0 0 0 4.688.01v2.314a15.719 15.719 0 0 1-4.688 0Zm6.25-.322v-2.285c1.26-.303 2.325-.762 3.125-1.328v1.377c0 .82-1.21 1.7-3.125 2.236Z"
        fill="fill-grey-light-950 dark:fill-grey-dark-950"
      />
    </StyledSvg>
  );
};
