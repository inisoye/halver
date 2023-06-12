import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { KeyboardStickyButton, Screen, Text } from '@/components';
import { AppRootStackParamList } from '@/navigation';

type BillAmountProps = NativeStackScreenProps<AppRootStackParamList, 'Bill Amount'>;

export const BillAmount = ({ navigation }: BillAmountProps) => {
  return (
    <Screen hasNoIOSBottomInset>
      <ScrollView keyboardDismissMode="interactive">
        <View className="p-2 px-6">
          <Text>This is the bill amount</Text>
        </View>
      </ScrollView>

      <KeyboardStickyButton
        color="casal"
        isTextContentOnly
        onPress={() => navigation.navigate('Bill Details')}
      >
        Continue
      </KeyboardStickyButton>
    </Screen>
  );
};
