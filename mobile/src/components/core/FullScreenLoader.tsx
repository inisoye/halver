import * as React from 'react';
import { Modal, View } from 'react-native';
import { Plane } from 'react-native-animated-spinkit';

import { colors } from '@/theme';

import { Text } from './Text';

export const FullScreenLoader: React.FunctionComponent = () => {
  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View
        className="flex-1 items-center justify-center "
        style={{
          backgroundColor: colors['grey-a-light'][900],
        }}
      >
        <View
          className="w-full max-w-[60%] items-center justify-center rounded-md bg-grey-light-100 py-6 dark:bg-grey-dark-200"
          style={{ gap: 12 }} //  eslint-disable-line react-native/no-inline-styles
        >
          {/* <ActivityIndicator color={colors.apricot.DEFAULT} size="large" /> */}
          <Plane color={colors.apricot.DEFAULT} size={48} />

          <Text>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};
