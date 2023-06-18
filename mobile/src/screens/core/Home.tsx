import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Box, Button, Card, Screen, Text } from '@/components';
import { ActionStatusCounts } from '@/features/home';
import { HalverMillipede } from '@/icons';
import { AppRootStackParamList } from '@/navigation';

type HomeProps = NativeStackScreenProps<AppRootStackParamList, 'Home'>;

const customStyles = StyleSheet.create({
  cardSubheading: {
    maxWidth: 190,
  },
});

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

          <Text
            color="textLight"
            marginBottom="6"
            style={customStyles.cardSubheading}
            variant="sm"
          >
            You can invite a maximum of sixteen people to it.
          </Text>

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
