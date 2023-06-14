import React from 'react';
import { KeyboardAvoidingView, View, ViewStyle } from 'react-native';

import { cn } from '@/utils';

/**
 * Custom barebones keyboard sticky component.
 * Largely inspired by: https://github.com/jinsoo601/rn-keyboard-sticky-view.
 */

interface KeyboardStickyViewProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export const KeyboardStickyView: React.FunctionComponent<KeyboardStickyViewProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        className={cn(
          'absolute bottom-10 w-full bg-main-bg-light dark:bg-grey-dark-50',
          className,
        )}
        style={style}
      >
        {children}
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 h-10 w-full bg-main-bg-light dark:bg-grey-dark-50" />
    </>
  );
};
