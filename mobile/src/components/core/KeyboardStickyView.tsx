import React from 'react';
import { KeyboardAvoidingView, StyleSheet, ViewStyle } from 'react-native';

import { isIOS } from '@/utils';

/**
 * Custom barebones keyboard sticky component.
 * Largely inspired by: https://github.com/jinsoo601/rn-keyboard-sticky-view.
 */

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
  },
});

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
    <KeyboardAvoidingView
      behavior={isIOS() ? 'padding' : 'height'}
      className={className}
      keyboardVerticalOffset={40}
      style={[styles.container, style]}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
