import { styled } from 'nativewind';
import * as React from 'react';
import { SafeAreaView as ReactNativeSafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaViewProps {
  children: React.ReactNode;
}

export const StyledReactNativeSafeAreaView = styled(ReactNativeSafeAreaView);

export const SafeAreaView: React.FunctionComponent<SafeAreaViewProps> = ({ children }) => {
  return (
    <StyledReactNativeSafeAreaView className="min-h-screen bg-[#E4E2E4] dark:bg-grey-dark-50">
      {children}
    </StyledReactNativeSafeAreaView>
  );
};
