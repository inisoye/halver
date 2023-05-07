import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';
import Animated from 'react-native-reanimated';

import { useButtonAnimation } from '@/hooks';
import { cn } from '@/utils';

const buttonSizes = {
  default: 'w-full flex-row items-center justify-center rounded px-6 py-3 disabled:opacity-50',
  sm: 'py-2 px-4',
  xs: 'py-1.5 px-3',
};

export const buttonTextSizes = {
  default: 'text-[16px] font-sans-bold tracking-[-0.1px]',
  sm: 'text-[14px]',
  xs: 'text-[12px]',
};

const buttonColors = {
  default: '',
  apricot: 'bg-apricot',
  casal: 'bg-casal',
  pharlap: 'bg-pharlap',
  neutral: 'bg-grey-light-200 dark:bg-grey-dark-200',
};

const buttonTextColors = {
  default: '',
  apricot: 'text-grey-light-50 dark:text-grey-dark-50',
  casal: 'text-grey-dark-1000',
  pharlap: 'text-grey-light-50 dark:text-grey-dark-50',
  neutral: 'text-grey-light-1000 dark:text-grey-dark-1000',
};

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  className?: string;
  color?: keyof typeof buttonColors;
  disabled?: boolean;
  isHapticsEnabled?: boolean;
  isTextContentOnly: boolean;
  onPress: () => void;
  pressableClassName?: string;
  size?: keyof typeof buttonSizes;
  textClassName?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FunctionComponent<ButtonProps> = ({
  children,
  className,
  color = 'default',
  disabled = false,
  isHapticsEnabled = true,
  isTextContentOnly = true,
  onPress,
  pressableClassName,
  size = 'default',
  textClassName = 'default',
  ...otherProps
}) => {
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation({ disabled });

  const handlePress = () => {
    onPress();

    if (isHapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <>
      <AnimatedPressable
        className={cn(
          pressableClassName,
          buttonSizes.default,
          buttonSizes[size],
          buttonColors[color],
          className,
        )}
        disabled={disabled}
        style={[animatedStyle]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...otherProps}
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
      </AnimatedPressable>
    </>
  );
};
