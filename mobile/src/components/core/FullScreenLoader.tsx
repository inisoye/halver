import * as React from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';

import { colors, gapStyles } from '@/theme';
import { cn } from '@/utils';

import { Text } from './Text';

interface FullScreenLoaderProps {
  isVisible: boolean;
  message?: string;
}

export const FullScreenLoader: React.FunctionComponent<FullScreenLoaderProps> = ({
  isVisible = false,
  message = 'Loading...',
}) => {
  return (
    <Modal animationType="fade" key={message} transparent={true} visible={isVisible}>
      <View
        className={cn('z-10 flex-1 items-center justify-center', !isVisible && 'hidden')}
        style={{
          backgroundColor: colors['grey-a-light'][900],
        }}
      >
        <View
          className="mx-auto w-full max-w-[250px] items-center justify-center rounded-md bg-grey-light-100 px-12 py-8 dark:bg-grey-dark-200"
          style={gapStyles[12]}
        >
          <ActivityIndicator color={colors.apricot.DEFAULT} size="large" />
          <Text isCentered>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};
