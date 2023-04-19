import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type MultipleContributionsProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });
const StyledCircle = styled(Circle, { classProps: ['fill', 'stroke'] });

export const MultipleContributions: React.FunctionComponent<MultipleContributionsProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={78}
      viewBox="0 0 78 78"
      width={78}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <StyledCircle cx={39} cy={39} r={12.425} stroke="stroke-grey-dark-1000" strokeWidth={1.4} />
      <StyledPath
        d="M44.83 37.739v1.136H33.239v-1.136h11.59Zm0 2.454v1.137H33.239v-1.137h11.59Zm-1.182-6.704v11.636h-1.364l-6.34-9.136h-.114v9.136h-1.41V33.489h1.364l6.364 9.159h.113v-9.16h1.387ZM6.75 60.689l5.126 1.373 1.374-5.126-5.126-1.373-1.374 5.126Zm22.194-12.814H21.44l3.753 6.5 3.752-6.5Zm-18.619 11.5 13.878-8.012-.65-1.126L9.675 58.25l.65 1.125ZM.247 39 4 42.753 7.753 39 4 35.247.247 39Zm25.628 0-6.5-3.753v7.506l6.5-3.753ZM4 39.65h16.025v-1.3H4v1.3ZM39 .247 35.247 4 39 7.753 42.753 4 39 .247Zm0 25.628 3.753-6.5h-7.506l3.753 6.5ZM38.35 4v16.025h1.3V4h-1.3Zm-8.406 25.813-3.752-6.5-3.753 6.5h7.505ZM7.75 16.998l1.374 5.126 5.126-1.374-1.374-5.126-5.126 1.374Zm17.453 9.326-13.878-8.013-.65 1.126 13.878 8.012.65-1.125ZM77.467 39a3.467 3.467 0 1 0-6.934 0 3.467 3.467 0 0 0 6.934 0Zm-25.342 0 6.5 3.753v-7.506L52.125 39ZM74 38.35H57.975v1.3H74v-1.3Zm-25.375 9.4 3.753 6.5 3.753-6.5h-7.506Zm15.942 9.204a3.467 3.467 0 1 0 6.004 3.467 3.467 3.467 0 0 0-6.004-3.467Zm-11.2-5.716 13.877 8.012.65-1.125-13.878-8.013-.65 1.126Zm-6.492-22.3h7.506l-3.753-6.5-3.753 6.5Zm15.942-9.205a3.467 3.467 0 1 0 6.004-3.466 3.467 3.467 0 0 0-6.004 3.466Zm-10.55 6.842 13.877-8.012-.65-1.126-13.878 8.013.65 1.125ZM39 77.467a3.467 3.467 0 1 0 0-6.934 3.467 3.467 0 0 0 0 6.934Zm0-25.342-3.753 6.5h7.506L39 52.125ZM39.65 74V57.975h-1.3V74h1.3Z"
        fill="fill-grey-dark-1000"
      />
    </StyledSvg>
  );
};
