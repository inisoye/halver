import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';

import { Screen } from '@/components';
import { ActionStatusCounts } from '@/features/home';
import { AppRootStackParamList } from '@/navigation';

type HomeProps = NativeStackScreenProps<AppRootStackParamList, 'Home'>;

export const Home = ({ navigation }: HomeProps) => {
  return (
    <Screen hasNoIOSBottomInset>
      <View className="flex-1 p-2 px-6">
        <ActionStatusCounts navigation={navigation} />
      </View>
    </Screen>
  );
};
