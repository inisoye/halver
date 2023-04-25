import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Button, View } from 'react-native';

import { Screen, Text } from '@/components';
import { AppRootStackParamList } from '@/navigation';

type BillAmountProps = NativeStackScreenProps<AppRootStackParamList, 'Home'>;

export const BillAmount = ({ navigation }: BillAmountProps) => {
  return (
    <Screen>
      <View className="p-2 px-6">
        <Text>This is the bill amount</Text>
      </View>
      <Button title="Go to Details" onPress={() => navigation.navigate('Bill Details')} />
    </Screen>
  );
};
