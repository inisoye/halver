import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type UserFolderProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledPath = styled(Path, { classProps: ['fill', 'stroke'] });

export const UserFolder: React.FunctionComponent<UserFolderProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <StyledSvg
      className={className}
      fill="none"
      height={18}
      viewBox="0 0 20 18"
      width={20}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <StyledPath
        d="M18.12 14.62a3 3 0 1 0-4.24 0 3.75 3.75 0 0 0-1.605 2.187.75.75 0 1 0 1.45.385c.265-.996 1.2-1.692 2.275-1.692 1.074 0 2.01.696 2.275 1.692a.751.751 0 0 0 1.474-.09.749.749 0 0 0-.024-.295 3.75 3.75 0 0 0-1.605-2.186ZM16 11a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.75-6.75v3a.75.75 0 1 1-1.5 0v-3h-8c-.324 0-.64-.106-.9-.3L6.75 2h-5v12.75h7.5a.75.75 0 1 1 0 1.5h-7.5a1.5 1.5 0 0 1-1.5-1.5V2A1.5 1.5 0 0 1 1.75.5h5c.324 0 .64.106.9.3l2.6 1.95h8a1.5 1.5 0 0 1 1.5 1.5Z"
        fill="fill-grey-light-50 dark:fill-grey-dark-50"
      />
    </StyledSvg>
  );
};
