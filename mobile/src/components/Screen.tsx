import { useNavigation, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Back as BackIcon } from '@/icons';
import { cn } from '@/utils';

import { Text } from './Text';

interface ScreenHeaderProps {
  name: string;
}

const ScreenHeader: React.FunctionComponent<ScreenHeaderProps> = ({ name }) => {
  const navigation = useNavigation();

  const isHomePage = name === 'Home';

  return (
    //  eslint-disable-next-line react-native/no-inline-styles
    <View className="flex-row items-center px-6 py-4" style={{ gap: 16 }}>
      <TouchableOpacity
        className={cn(!navigation.canGoBack() && 'hidden')}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <BackIcon />
      </TouchableOpacity>

      <Text variant="2xl">{name}</Text>
    </View>
  );
};

interface ScreenProps {
  children: React.ReactNode;
}

export const Screen: React.FunctionComponent<ScreenProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { name } = useRoute();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-1 bg-[#E4E2E4] dark:bg-grey-dark-50"
    >
      <ScreenHeader name={name} />

      {children}
    </View>
  );
};
