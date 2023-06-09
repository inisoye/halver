import * as React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/utils';

export const textVariants = {
  default: 'text-base text-grey-light-1000 dark:text-grey-dark-1000 tracking-[-0.1px]',
  '4xl': 'text-[32px] leading-[48px] tracking-[-0.7px]',
  '3xl': 'text-[28px] leading-[42px] tracking-[-0.7px]',
  '2xl': 'text-[24px] leading-[28px] tracking-[-0.8px]',
  xl: 'text-[20px] leading-[24px] tracking-[-0.65px]',
  lg: 'text-[18px] leading-[26px]',
  sm: 'text-[14px] leading-[18px]',
  xs: 'text-[12px] leading-[15px]',
  xxs: 'text-[10px] leading-[12px]',
};

const colorVariants = {
  default: 'text-grey-light-1000 dark:text-grey-dark-1000',
  inverse: 'text-grey-light-50 dark:text-grey-dark-50',
  white: 'text-grey-light-50 dark:text-grey-dark-1000',
  black: 'text-grey-light-1000 dark:text-grey-dark-50',
  light: 'text-grey-light-950 dark:text-grey-dark-950',
  lighter: 'text-grey-light-900 dark:text-grey-dark-900',
};

const weightVariants = {
  default: 'font-sans-medium',
  bold: 'font-sans-bold',
};

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  className?: string;
  color?: keyof typeof colorVariants;
  isCentered?: boolean;
  variant?: keyof typeof textVariants;
  weight?: keyof typeof weightVariants;
  numberOfLines?: number;
}

export const Text: React.FunctionComponent<TextProps> = ({
  children,
  className,
  color = 'default',
  isCentered = false,
  variant = 'default',
  weight = 'default',
  numberOfLines,
}) => {
  return (
    <RNText
      className={cn(
        textVariants.default,
        textVariants[variant],
        colorVariants[color],
        weightVariants[weight],
        isCentered && 'text-center',
        className,
      )}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};
