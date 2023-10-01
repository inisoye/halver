import * as React from 'react';
import { ActivityIndicator, Modal } from 'react-native';

import { colors } from '@/theme';

import { Box } from './Box';
import { Text } from './Text';

interface FullScreenLoaderProps {
  isVisible: boolean;
  message?: string;
}

export const FullScreenLoader: React.FunctionComponent<
  FullScreenLoaderProps
> = ({ isVisible = false, message = 'Loading...' }) => {
  return (
    <Modal
      animationType="fade"
      key={message}
      transparent={true}
      visible={isVisible}
      statusBarTranslucent
    >
      <Box
        alignItems="center"
        backgroundColor="modalOverlay"
        flex={1}
        justifyContent="center"
        visible={isVisible}
        zIndex="10"
      >
        <Box
          alignItems="center"
          backgroundColor="elementBackground"
          borderRadius="md"
          gap="3"
          justifyContent="center"
          marginLeft="auto"
          marginRight="auto"
          maxWidth={240}
          paddingHorizontal="12"
          paddingVertical="6"
        >
          <ActivityIndicator color={colors.apricot.DEFAULT} size="large" />
          <Text textAlign="center">{message}</Text>
        </Box>
      </Box>
    </Modal>
  );
};
