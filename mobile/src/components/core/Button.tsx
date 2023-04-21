import * as React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

import { cn } from '@/utils';

const buttonSizes = {
  default: 'py-3 px-6 flex-row items-center rounded justify-center w-full',
  sm: 'py-2 px-4',
  xs: 'py-1.5 px-3',
};

export const buttonTextSizes = {
  default: 'text-base font-sans-bold tracking-[-0.1px]',
  sm: 'text-[14px]',
  xs: 'text-[12px]',
};

const buttonColors = {
  default: '',
  apricot: 'bg-apricot',
  casal: 'bg-casal',
  pharlap: 'bg-pharlap',
  neutral: 'bg-grey-light-300 dark:bg-grey-dark-300',
};

const buttonTextColors = {
  default: '',
  apricot: 'text-grey-dark-50',
  casal: 'text-grey-dark-1000',
  pharlap: 'text-grey-dark-50',
  neutral: 'text-grey-light-1000 dark:text-grey-dark-1000',
};

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  size?: keyof typeof buttonSizes;
  color?: keyof typeof buttonColors;
  className?: string;
  textClassName?: string;
  isTextContentOnly: boolean;
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  children,
  size = 'default',
  textClassName = 'default',
  color = 'default',
  className,
  isTextContentOnly = true,
  ...otherPressableProps
}) => {
  return (
    <>
      <Pressable
        className={cn(buttonSizes.default, buttonSizes[size], buttonColors[color], className)}
        {...otherPressableProps}
      >
        {isTextContentOnly ? (
          <Text
            className={cn(
              buttonTextSizes.default,
              buttonTextSizes[size],
              buttonTextColors[color],
              textClassName,
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    </>
  );
};
