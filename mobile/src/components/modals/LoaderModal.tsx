import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ModalComponentProp, ModalComponentWithOptions } from 'react-native-modalfy';

import { ModalStackParams } from '@/lib/modalfy';
import { colors } from '@/theme';

import { Text } from '../core';

interface LoaderModalProps {
  message?: string;
}

export const LoaderModal: ModalComponentWithOptions<
  ModalComponentProp<ModalStackParams, LoaderModalProps, keyof ModalStackParams>
> = ({ modal: { params } }) => {
  return (
    <View
      className="items-center justify-center rounded-md bg-grey-light-100 px-12 py-6 dark:bg-grey-dark-200"
      style={{ gap: 12 }} //  eslint-disable-line react-native/no-inline-styles
    >
      <ActivityIndicator color={colors.apricot.DEFAULT} size="large" />
      <Text className="text-center">{params?.message || 'Loading...'}</Text>
    </View>
  );
};

LoaderModal.modalOptions = {
  backBehavior: 'none', // to disable back button & outside touches
  disableFlingGesture: true, // optionally: to disable fling-to-close gesture
};
