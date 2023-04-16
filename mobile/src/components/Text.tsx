import * as React from 'react';
import { Text as RNText } from 'react-native';

import { cn } from '@/utils';

export const textVariants = {
  default:
    'text-base text-grey-light-1000 dark:text-grey-dark-1000 font-medium font-sans-medium tracking-[-0.1px]',
  '4xl': 'text-[32px] leading-[48px] tracking-[-0.4px] font-sans-bold font-semibold',
  '3xl': 'text-[28px] leading-[42px] tracking-[-0.4px] font-sans-bold font-semibold',
  '2xl': 'text-[24px] leading-[36px] tracking-[-0.4px] font-sans-bold font-semibold',
  xl: 'text-[20px] leading-[30px] tracking-[-0.4px] font-sans-bold font-semibold',
  lg: 'text-[18px] leading-[26px]',
  sm: 'text-[14px] leading-[21px]',
  xs: 'text-[12px] leading-[18px]',
};

interface TextProps {
  children: React.ReactNode;
  variant?: keyof typeof textVariants;
  className?: string;
}

export const Text: React.FunctionComponent<TextProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  return (
    <RNText className={cn(textVariants.default, textVariants[variant], className)}>
      {children}
    </RNText>
  );
};
