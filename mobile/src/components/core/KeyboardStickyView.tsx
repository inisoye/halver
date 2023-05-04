import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, ViewStyle } from 'react-native';

/**
 * Custom barebones keyboard sticky component.
 * Largely inspired by: https://github.com/jinsoo601/rn-keyboard-sticky-view.
 */

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={className}
      keyboardVerticalOffset={0}
      style={[styles.container, style]}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
