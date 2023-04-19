import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type SubscriptionsProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });

export const Subscriptions: React.FunctionComponent<SubscriptionsProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={64}
      viewBox="0 0 83 64"
      width={83}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <StyledPath
        d="M43.335 52.077v-12.77l5.17-.307v24l-5.17-.308m-6.154-12.769v12.77L32.013 63V39l5.17.308m-.013 0L48.517 63M32 39l11.348 23.692"
        fill="fill-transparent"
        stroke="stroke-grey-dark-200"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
      />
      <StyledPath
        d="M61.591 10.348a.64.64 0 0 1-.767-.479 4.478 4.478 0 0 1 3.36-5.368.639.639 0 0 1 .766.48 4.478 4.478 0 0 1-3.36 5.365l.001.002ZM73.713 21.38a.638.638 0 0 1 .36.735c-1.18 4.896-2.43 7.486-4.028 7.854-.745.17-1.531.099-2.352-.206a3.326 3.326 0 0 0-3.465.718c-.743.715-1.505 1.172-2.286 1.352-2.354.542-7.9-5.81-8.816-9.786-.976-4.242.504-7.992 3.889-8.77 1.592-.367 3.021-.447 4.285-.24a1.911 1.911 0 0 0 1.512-.39c.833-.667 2.018-1.17 3.553-1.523 1.874-.43 3.719.127 5.492 1.625a.64.64 0 0 1 .077.902c-1.254 1.484-1.69 2.928-1.355 4.38.334 1.454 1.357 2.561 3.134 3.35Z"
        fill="fill-transparent"
        stroke="stroke-grey-dark-200"
        strokeWidth={1.5}
      />
      <StyledPath
        d="m23.301 15.725-7.144-2.142-1.292 4.309 7.144 2.142m1.292-4.31-1.291 4.31m1.291-4.31 7.145 2.142M23.3 15.725l1.292-4.309m-2.584 8.617 7.145 2.142m1.291-4.309-1.291 4.31m1.291-4.31 7.145 2.142m-7.145-2.142 1.292-4.308m-2.583 8.617 7.144 2.142m1.292-4.309-1.292 4.309m1.292-4.309 7.144 2.142m-7.144-2.142 1.292-4.309m-2.584 8.618 7.145 2.141 1.291-4.308m0 0 1.292-4.309m-21.433-6.425 7.144 2.142m-7.144-2.142 1.291-4.309L33.03 9.25l-1.292 4.309m0 0 7.145 2.141m0 0 7.144 2.142M38.883 15.7l1.291-4.308 7.145 2.141-1.292 4.309m-4.56-10.766 7.145 2.141-1.291 4.309-7.145-2.142 1.292-4.308Z"
        fill="fill-transparent"
        stroke="stroke-grey-dark-200"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <StyledPath
        d="m63.655 46.164-1.55 2.918-.765-3.215m13.74 2.991a1.167 1.167 0 1 0-2.315-.297l-.096.752a1.167 1.167 0 1 0 2.314.297l.097-.752Z"
        stroke="stroke-grey-dark-200"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.6}
      />
      <StyledPath
        d="M64.95 45.3a.408.408 0 1 0 .104-.81.408.408 0 0 0-.104.81Z"
        fill="fill-grey-dark-200"
      />
      <StyledPath
        d="m64.82 46.313-.393 3.067m6.866.287a1.167 1.167 0 0 1-1.08.455v0a1.167 1.167 0 0 1-1.01-1.306l.097-.752a1.167 1.167 0 0 1 1.306-1.009v0a1.167 1.167 0 0 1 1.009 1.306l-.048.376-2.315-.297m-1.109-.524a1.167 1.167 0 0 0-2.314-.297l-.097.752a1.167 1.167 0 0 0 2.315.297m-.149 1.157.594-4.629"
        stroke="stroke-grey-dark-200"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.6}
      />
      <StyledPath
        d="M66.405 61.44c6.87.88 13.154-3.974 14.035-10.845.88-6.87-3.974-13.154-10.845-14.035-6.87-.881-13.154 3.974-14.035 10.844-.88 6.87 3.974 13.155 10.845 14.036Z"
        fill="fill-transparent"
        stroke="stroke-grey-dark-200"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <StyledPath
        d="M72.39 52.742c.677-.178 1.867-.378 2.158.085.314.5-.282 1.42-.814 2.127"
        stroke="stroke-grey-dark-200"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <StyledPath
        d="M60.5 51.524c.914.94 3.761 2.562 6.963 2.972a9.918 9.918 0 0 0 6.111-1.027"
        stroke="stroke-grey-dark-200"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <StyledPath
        d="M12.533 25.657a12.187 12.187 0 1 0 14.783 8.861 12.199 12.199 0 0 0-14.783-8.86Zm5.466 21.826a10.313 10.313 0 1 1 7.498-12.51A10.324 10.324 0 0 1 18 47.484Zm3.655-13.48a.926.926 0 0 1-1.13.694 12.222 12.222 0 0 0-10.797 2.717.95.95 0 0 1-.395.207.937.937 0 0 1-.84-1.614 14.05 14.05 0 0 1 12.457-3.132.938.938 0 0 1 .705 1.129Zm-.877 3.639a.938.938 0 0 1-1.128.705 8.435 8.435 0 0 0-7.431 1.874.937.937 0 0 1-.384.205.938.938 0 0 1-.853-1.623 10.324 10.324 0 0 1 9.094-2.278.938.938 0 0 1 .703 1.117Zm-.873 3.65a.949.949 0 0 1-1.128.705 4.663 4.663 0 0 0-4.067 1.03 1.1 1.1 0 0 1-.386.194.937.937 0 0 1-.84-1.614 6.446 6.446 0 0 1 2.694-1.4 6.527 6.527 0 0 1 3.01-.04.937.937 0 0 1 .717 1.125Z"
        fill="fill-grey-dark-200"
      />
    </StyledSvg>
  );
};
