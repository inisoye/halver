import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type EmptyAvatarSquareProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });

export const EmptyAvatarSquare: React.FunctionComponent<EmptyAvatarSquareProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={161}
      viewBox="0 0 161 161"
      width={161}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <StyledPath
        d="M149.878.313H10.748A10.435 10.435 0 0 0 .312 10.746v139.131a10.435 10.435 0 0 0 10.434 10.434h139.131a10.434 10.434 0 0 0 10.434-10.434V10.748A10.434 10.434 0 0 0 149.878.312ZM23.791 153.356a59.127 59.127 0 0 1 56.522-41.761 59.126 59.126 0 0 1 56.521 41.761H23.791Zm129.565-3.478c0 .922-.366 1.807-1.019 2.459a3.475 3.475 0 0 1-2.459 1.019h-5.792a66.082 66.082 0 0 0-45.87-46.2 38.26 38.26 0 1 0-35.808 0 66.092 66.092 0 0 0-45.87 46.2h-5.79a3.476 3.476 0 0 1-3.479-3.478V10.748a3.478 3.478 0 0 1 3.478-3.479h139.131a3.477 3.477 0 0 1 3.478 3.478v139.131ZM80.313 104.66A31.307 31.307 0 0 1 51.39 85.336a31.305 31.305 0 1 1 28.922 19.324Z"
        fill="fill-grey-light-700 dark:fill-grey-dark-700"
      />
    </StyledSvg>
  );
};
