import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserDetails } from '@/features/account/api';
import { Back as BackIcon } from '@/icons';
import { gapStyles } from '@/theme';
import { cn, isIOS } from '@/utils';

import { Text } from './Text';

interface ScreenHeaderProps {
  name: string;
  isHeaderTextShown?: boolean;
}

const screensWithNoBackButton = ['Home'];
const screensWithLightHeading = ['Home'];

const ScreenHeader: React.FunctionComponent<ScreenHeaderProps> = ({
  name,
  isHeaderTextShown = true,
}) => {
  const navigation = useNavigation();
  const { data: userDetails } = useUserDetails();

  const peculiarScreenNames = { Home: `Hello ${userDetails?.firstName}` };
  const isScreenNamePeculiar = Object.keys(peculiarScreenNames).includes(name);
  const screenName = isScreenNamePeculiar ? peculiarScreenNames[name] : name;

  const hasNoBackButton = screensWithNoBackButton.includes(name);
  const hasLightHeading = screensWithLightHeading.includes(name);

  return (
    <View className="flex-row items-center px-6 py-4" style={gapStyles[16]}>
      <TouchableOpacity
        className={cn(hasNoBackButton && 'hidden')}
        hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <BackIcon />
      </TouchableOpacity>

      {isHeaderTextShown && (
        <Text color={hasLightHeading ? 'light' : 'default'} variant="2xl" weight="bold">
          {screenName}
        </Text>
      )}
    </View>
  );
};

interface ScreenProps {
  children: React.ReactNode;
  isHeaderShown?: boolean;
  isHeaderTextShown?: boolean;
  hasVerticalStack?: boolean;
  hasNoIOSBottomInset?: boolean;
  className?: string;
}

export const Screen: React.FunctionComponent<ScreenProps> = ({
  children,
  isHeaderShown = true,
  isHeaderTextShown = true,
  className,
  hasNoIOSBottomInset = false, // Added to make sticky buttons sit properly on IOS
}) => {
  const insets = useSafeAreaInsets();
  const { name } = useRoute();

  return (
    <View
      className={cn('flex-1 bg-main-bg-light dark:bg-grey-dark-50', className)}
      style={{
        paddingTop: insets.top,
        paddingBottom: hasNoIOSBottomInset && isIOS() ? undefined : insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {isHeaderShown && (
        <ScreenHeader isHeaderTextShown={isHeaderTextShown} name={name} />
      )}

      {children}
    </View>
  );
};
