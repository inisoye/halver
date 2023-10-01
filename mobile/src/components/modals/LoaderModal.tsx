import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import {
  ModalComponentProp,
  ModalComponentWithOptions,
} from 'react-native-modalfy';

import { ModalStackParams } from '@/lib/modalfy';
import { colors } from '@/theme';

import { Box, Text } from '../core';

interface LoaderModalProps {
  message?: string;
}

export const LoaderModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParams, LoaderModalProps, keyof ModalStackParams>
> = ({ modal: { params } }) => {
  return (
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
      width="100%"
      zIndex="10"
    >
      <ActivityIndicator color={colors.apricot.DEFAULT} size="large" />
      <Text textAlign="center">{params?.message || 'Loading...'}</Text>
    </Box>
  );
};

LoaderModal.modalOptions = {
  backBehavior: 'none', // to disable back button & outside touches
  disableFlingGesture: true, // optionally: to disable fling-to-close gesture
};
