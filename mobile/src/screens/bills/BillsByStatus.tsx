import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';

import { Screen, Text } from '@/components';
import { AppRootStackParamList } from '@/navigation';

type BillsByStatusProps = NativeStackScreenProps<
  AppRootStackParamList,
  'Bills By Status'
>;

export const BillsByStatus = ({ route }: BillsByStatusProps) => {
  const { status } = route.params;

  return (
    <Screen customScreenName={`${status} bills`} isModal>
      <View className="p-2 px-6">
        <Text>This is for "{status}" bills</Text>
      </View>
    </Screen>
  );
};
