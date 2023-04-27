import * as React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '@/utils';

export const textVariants = {
  default:
    'text-base text-grey-light-1000 dark:text-grey-dark-1000 font-sans-medium tracking-[-0.1px]',
  '4xl': 'text-[32px] leading-[48px] tracking-[-1px] font-sans-bold',
  '3xl': 'text-[28px] leading-[42px] tracking-[-1px] font-sans-bold',
  '2xl': 'text-[24px] leading-[36px] tracking-[-1px] font-sans-bold',
  xl: 'text-[20px] leading-[30px] tracking-[-1px] font-sans-bold',
  lg: 'text-[18px] leading-[26px]',
  sm: 'text-[14px] leading-[21px]',
  xs: 'text-[12px] leading-[18px]',
  xxs: 'text-[10px] leading-[12px] font-sans-bold',
};

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  variant?: keyof typeof textVariants;
  className?: string;
  isLight?: boolean;
}

export const Text: React.FunctionComponent<TextProps> = ({
  children,
  variant = 'default',
  className,
  isLight = false,
}) => {
  return (
    <RNText
      className={cn(
        textVariants.default,
        textVariants[variant],
        isLight && 'text-grey-light-950 dark:text-grey-dark-950',
        className,
      )}
    >
      {children}
    </RNText>
  );
};
