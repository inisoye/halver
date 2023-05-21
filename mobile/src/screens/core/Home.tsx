import * as React from 'react';
import { Button, View } from 'react-native';

import { Screen, Text } from '@/components';
import { showToast } from '@/lib/root-toast';

export const Home: React.FunctionComponent = () => {
  return (
    <>
      <Screen hasNoIOSBottomInset>
        <View className="flex-1 p-2 px-6">
          <Text>This is the home</Text>

          <Button
            title="Launch pharlap toast"
            onPress={() => showToast('This is the toast', 'pharlap')}
          />
        </View>
      </Screen>
    </>
  );
};
