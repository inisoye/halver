import * as React from 'react';
import { TextInput, View } from 'react-native';

import { Button, PaddedScreenHeader, Screen, Text } from '@/components';

export const MoreUserDetails: React.FunctionComponent = () => {
  const [number, onChangeNumber] = React.useState('');

  return (
    <Screen isHeaderShown={false} hasLogoFooter>
      <PaddedScreenHeader
        heading="What's your phone number?"
        subHeading="This will make friends find you easily on Halver."
        hasExtraPadding
      />

      <View className="mt-10 p-2 px-6">
        <Text className="mb-1.5" variant="sm" isLight>
          Your phone number
        </Text>

        <View
          className="flex-row"
          style={{ gap: 4 }} // eslint-disable-line react-native/no-inline-styles
        >
          <View className="justify-center rounded bg-grey-light-200 px-3 dark:bg-grey-dark-200">
            <Text isLight>+234</Text>
          </View>

          <TextInput
            className="flex-1 rounded bg-grey-light-200 p-3 font-sans-medium text-[16px] text-grey-light-1000 dark:bg-grey-dark-200 dark:text-grey-dark-1000"
            keyboardType="phone-pad"
            value={number}
            onChangeText={onChangeNumber}
          />
        </View>

        <Button
          className="mt-12"
          color="casal"
          isTextContentOnly
          onPress={() => {
            console.log('pressed');
          }}
        >
          Continue
        </Button>
      </View>
    </Screen>
  );
};
