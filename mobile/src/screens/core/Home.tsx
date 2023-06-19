import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, Button, Card, DynamicText, Screen, Text } from '@/components';
import { ActionStatusCounts } from '@/features/home';
import { HalverMillipede } from '@/icons';
import { AppRootStackParamList } from '@/navigation';

type HomeProps = NativeStackScreenProps<AppRootStackParamList, 'Home'>;

export const Home = ({ navigation }: HomeProps) => {
  return (
    <Screen hasNoIOSBottomInset>
      <Box flex={1} paddingHorizontal="6" paddingVertical="2">
        <ActionStatusCounts navigation={navigation} />

        <Card
          alignItems="flex-start"
          overflow="hidden"
          paddingHorizontal="4"
          paddingVertical="5"
        >
          <Text fontFamily="Halver-Semibold" marginBottom="4" variant="xl">
            Create your first bill
          </Text>

          <DynamicText color="textLight" marginBottom="6" maxWidth={190} variant="sm">
            You can invite a maximum of sixteen people to it.
          </DynamicText>

          <HalverMillipede />

          <Button
            backgroundColor="buttonCasal"
            hitSlop={100}
            marginTop="16"
            variant="sm"
            onPress={() => {
              navigation.navigate('Bill Details');
            }}
          >
            <Text color="buttonTextCasal" fontFamily="Halver-Semibold" variant="sm">
              Get started
            </Text>
          </Button>
        </Card>
      </Box>
    </Screen>
  );
};
