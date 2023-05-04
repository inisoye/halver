import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserDetails } from '@/features/account/api';
import { Back as BackIcon, HalverFooter } from '@/icons';
import { cn } from '@/utils';

import { Text } from './Text';

interface ScreenHeaderProps {
  name: string;
  isHeaderTextShown?: boolean;
}

const ScreenHeader: React.FunctionComponent<ScreenHeaderProps> = ({
  name,
  isHeaderTextShown = true,
}) => {
  const navigation = useNavigation();
  const { data: userDetails } = useUserDetails();

  const peculiarScreenNames = { Home: `Welcome ${userDetails?.firstName}` };
  const isScreenNamePeculiar = Object.keys(peculiarScreenNames).includes(name);
  const screenName = isScreenNamePeculiar ? peculiarScreenNames[name] : name;

  const screensWithNoBackButton = ['Home'];
  const hasNoBackButton = screensWithNoBackButton.includes(name);

  return (
    //  eslint-disable-next-line react-native/no-inline-styles
    <View className="flex-row items-center px-6 py-4" style={{ gap: 16 }}>
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
        <Text variant="2xl" weight="bold">
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
  hasLogoFooter?: boolean;
  className?: string;
}

export const Screen: React.FunctionComponent<ScreenProps> = ({
  children,
  isHeaderShown = true,
  isHeaderTextShown = true,
  hasLogoFooter = false,
  className,
}) => {
  const insets = useSafeAreaInsets();
  const { name } = useRoute();

  return (
    <View
      className={cn('flex-1 bg-main-bg-light dark:bg-grey-dark-50', className)}
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {isHeaderShown && <ScreenHeader isHeaderTextShown={isHeaderTextShown} name={name} />}

      {children}

      {hasLogoFooter && <HalverFooter className="absolute bottom-20 -z-10 self-center" />}
    </View>
  );
};
