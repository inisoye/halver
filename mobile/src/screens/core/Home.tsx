import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';

import { Button, Card, Screen, Text } from '@/components';
import { ActionStatusCounts } from '@/features/home';
import { HalverMillipede } from '@/icons';
import { AppRootStackParamList } from '@/navigation';

type HomeProps = NativeStackScreenProps<AppRootStackParamList, 'Home'>;

export const Home = ({ navigation }: HomeProps) => {
  return (
    <Screen hasNoIOSBottomInset>
      <View className="flex-1 p-2 px-6">
        <ActionStatusCounts navigation={navigation} />

        <Card className="items-start overflow-hidden rounded-lg px-4 py-6">
          <Text className="mb-4" variant="xl" weight="bold">
            Create your first bill
          </Text>

          <Text className="mb-6 max-w-[190px]" color="light" variant="sm">
            You can invite a maximum of sixteen people to it.
          </Text>

          <HalverMillipede className="mb-16 w-full" />

          <Button
            className="justify-start self-start"
            hitSlop={100}
            isFullWidth={false}
            size="sm"
            isTextContentOnly
            onPress={() => {
              navigation.navigate('Bill Details');
            }}
          >
            Get started
          </Button>
        </Card>
      </View>
    </Screen>
  );
};
