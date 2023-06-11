import { styled } from 'nativewind';
import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type HalverMillipedeProps = ISvgProps;

const StyledSvg = styled(Svg, { classProps: ['fill', 'stroke'] });
const StyledRect = styled(Rect, { classProps: ['fill', 'stroke'] });

export const HalverMillipede: React.FunctionComponent<HalverMillipedeProps> = ({
  className,
  ...otherProps
}) => {
  return (
    <>
      <StyledSvg
        className={className}
        fill="none"
        height={12}
        viewBox="0 0 654 12"
        width={654}
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <StyledRect
          fill="fill-pharlap-400 dark:fill-pharlap-700"
          height={12}
          rx={3}
          width={40}
        />
        <StyledRect
          fill="fill-gold-drop-400 dark:fill-gold-drop"
          height={12}
          rx={3}
          width={40}
          x={20}
        />
        <StyledRect
          fill="fill-casal-500 dark:fill-casal"
          height={12}
          rx={3}
          width={40}
          x={40}
        />
        <StyledRect
          fill="fill-apricot-400 dark:fill-apricot"
          height={12}
          rx={3}
          width={40}
          x={60}
        />
        <StyledRect
          fill="fill-pharlap-400 dark:fill-pharlap-700"
          height={12}
          rx={3}
          width={40}
          x={80}
        />
        <StyledRect
          fill="fill-gold-drop-400 dark:fill-gold-drop"
          height={12}
          rx={3}
          width={40}
          x={100}
        />
        <StyledRect
          fill="fill-casal-500 dark:fill-casal"
          height={12}
          rx={3}
          width={40}
          x={120}
        />
        <StyledRect
          fill="fill-apricot-400 dark:fill-apricot"
          height={12}
          rx={3}
          width={40}
          x={140}
        />
        <StyledRect
          fill="fill-pharlap-400 dark:fill-pharlap-700"
          height={12}
          rx={3}
          width={40}
          x={157}
        />
        <StyledRect
          fill="fill-gold-drop-400 dark:fill-gold-drop"
          height={12}
          rx={3}
          width={40}
          x={177}
        />
        <StyledRect
          fill="fill-casal-500 dark:fill-casal"
          height={12}
          rx={3}
          width={40}
          x={197}
        />
        <StyledRect
          fill="fill-apricot-400 dark:fill-apricot"
          height={12}
          rx={3}
          width={40}
          x={217}
        />
        <StyledRect
          fill="fill-pharlap-400 dark:fill-pharlap-700"
          height={12}
          rx={3}
          width={40}
          x={237}
        />
        <StyledRect
          fill="fill-gold-drop-400 dark:fill-gold-drop"
          height={12}
          rx={3}
          width={40}
          x={257}
        />
        <StyledRect
          fill="fill-casal-500 dark:fill-casal"
          height={12}
          rx={3}
          width={40}
          x={277}
        />
        <StyledRect
          fill="fill-apricot-400 dark:fill-apricot"
          height={12}
          rx={3}
          width={40}
          x={297}
        />
        <StyledRect
          fill="fill-pharlap-400 dark:fill-pharlap-700"
          height={12}
          rx={3}
          width={40}
          x={317}
        />
        <StyledRect
          fill="fill-gold-drop-400 dark:fill-gold-drop"
          height={12}
          rx={3}
          width={40}
          x={337}
        />
        <StyledRect
          fill="fill-casal-500 dark:fill-casal"
          height={12}
          rx={3}
          width={40}
          x={357}
        />
        <StyledRect
          fill="fill-apricot-400 dark:fill-apricot"
          height={12}
          rx={3}
          width={40}
          x={377}
        />
        <StyledRect
          fill="fill-pharlap-400 dark:fill-pharlap-700"
          height={12}
          rx={3}
          width={40}
          x={397}
        />
        <StyledRect
          fill="fill-gold-drop-400 dark:fill-gold-drop"
          height={12}
          rx={3}
          width={40}
          x={417}
        />
        <StyledRect
          fill="fill-casal-500 dark:fill-casal"
          height={12}
          rx={3}
          width={40}
          x={437}
        />
        <StyledRect
          fill="fill-apricot-400 dark:fill-apricot"
          height={12}
          rx={3}
          width={40}
          x={457}
        />
        <StyledRect
          fill="fill-pharlap-400 dark:fill-pharlap-700"
          height={12}
          rx={3}
          width={40}
          x={477}
        />
        <StyledRect
          fill="fill-gold-drop-400 dark:fill-gold-drop"
          height={12}
          rx={3}
          width={40}
          x={497}
        />
        <StyledRect
          fill="fill-casal-500 dark:fill-casal"
          height={12}
          rx={3}
          width={40}
          x={517}
        />
        <StyledRect
          fill="fill-apricot-400 dark:fill-apricot"
          height={12}
          rx={3}
          width={40}
          x={537}
        />
        <StyledRect
          fill="fill-pharlap-400 dark:fill-pharlap-700"
          height={12}
          rx={3}
          width={40}
          x={554}
        />
        <StyledRect
          fill="fill-gold-drop-400 dark:fill-gold-drop"
          height={12}
          rx={3}
          width={40}
          x={574}
        />
        <StyledRect
          fill="fill-casal-500 dark:fill-casal"
          height={12}
          rx={3}
          width={40}
          x={594}
        />
        <StyledRect
          fill="fill-apricot-400 dark:fill-apricot"
          height={12}
          rx={3}
          width={40}
          x={614}
        />
      </StyledSvg>
    </>
  );
};
