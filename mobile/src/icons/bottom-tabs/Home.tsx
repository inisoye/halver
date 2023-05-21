import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

interface HomeProps extends ISvgProps {
  focused?: boolean;
}

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });

export const Home: React.FunctionComponent<HomeProps> = ({
  focused,
  ...otherProps
}) => {
  if (focused) {
    return (
      <StyledSvg
        fill="none"
        height={19}
        viewBox="0 0 18 19"
        width={18}
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <StyledPath
          d="M18 8.828V17.5a1.51 1.51 0 0 1-.788 1.322A1.44 1.44 0 0 1 16.5 19H12a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v4.5A.75.75 0 0 1 6 19H1.5a1.491 1.491 0 0 1-1.125-.506A1.584 1.584 0 0 1 0 17.462V8.828a1.5 1.5 0 0 1 .488-1.106l7.5-6.816a1.5 1.5 0 0 1 2.024 0l7.5 6.816A1.499 1.499 0 0 1 18 8.828Z"
          fill="fill-grey-light-1000 dark:fill-grey-dark-1000"
        />
      </StyledSvg>
    );
  }

  return (
    <StyledSvg
      fill="none"
      height={19}
      viewBox="0 0 18 19"
      width={18}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <StyledPath
        d="M16.5 19H12a1.5 1.5 0 0 1-1.5-1.5V13h-3v4.5A1.5 1.5 0 0 1 6 19H1.5A1.5 1.5 0 0 1 0 17.5V8.828a1.5 1.5 0 0 1 .487-1.106l7.5-6.816a1.5 1.5 0 0 1 2.025 0l7.5 6.816A1.499 1.499 0 0 1 18 8.828V17.5a1.5 1.5 0 0 1-1.5 1.5Zm-9-7.5h3A1.5 1.5 0 0 1 12 13v4.5h4.5V8.828L9 2.012 1.5 8.828V17.5H6V13a1.5 1.5 0 0 1 1.5-1.5Z"
        fill="fill-grey-light-800 dark:fill-grey-dark-800"
      />
    </StyledSvg>
  );
};
