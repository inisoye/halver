import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { useMMKVString } from 'react-native-mmkv';

import {
  Box,
  Button,
  DynamicText,
  Modal,
  Text,
  TouchableOpacity,
} from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { apiClient, deleteAxiosDefaultToken } from '@/lib/axios';
import { allMMKVKeys, storage } from '@/lib/mmkv';
import { navigationRef } from '@/lib/react-navigation';
import { handleAxiosErrorAlertAndHaptics, isAndroid } from '@/utils';

import { useCloseAccount } from '../api';

export const CloseAccountModal: React.FunctionComponent = () => {
  const [_token, setToken] = useMMKVString(allMMKVKeys.token);

  const queryClient = useQueryClient();

  const { mutate: closeAccount, isLoading: isCloseAccountLoading } =
    useCloseAccount();

  const logOut = () => {
    closeAccount(undefined, {
      onSuccess: () => {
        queryClient.clear();
        deleteAxiosDefaultToken(apiClient);
        storage.clearAll();
        setToken(undefined);
        navigationRef.resetRoot({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      },

      onError: error => {
        handleAxiosErrorAlertAndHaptics('Upload failed', error as AxiosError);
      },
    });
  };

  const {
    state: isCancellationModalOpen,
    setTrue: openCancellationModal,
    setFalse: closeCancellationModal,
  } = useBooleanStateControl();

  const handleButtonPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    openCancellationModal();
  };

  return (
    <>
      <TouchableOpacity
        alignItems="center"
        alignSelf="center"
        backgroundColor="buttonNeutralDarker"
        borderRadius="md"
        flexDirection="row"
        gap="4"
        justifyContent="center"
        marginTop="60"
        paddingHorizontal="3"
        paddingVertical="2"
        onPress={handleButtonPress}
      >
        <DynamicText
          color="textLighter"
          fontFamily="Halver-Semibold"
          numberOfLines={1}
          textAlign="center"
          variant="xxs"
        >
          Close your account
        </DynamicText>
      </TouchableOpacity>

      <Modal
        closeModal={closeCancellationModal}
        headingText="It is so sad to say goodbye"
        isLoaderOpen={isCloseAccountLoading}
        isModalOpen={isCancellationModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          paddingBottom={isAndroid() ? '6' : '8'}
          paddingHorizontal="6"
          paddingTop="6"
        >
          <DynamicText color="textLight" marginBottom="6" width="90%">
            Closing your account will end all your subscriptions and clear your
            financial details.
          </DynamicText>

          <DynamicText
            fontFamily="Halver-Semibold"
            marginBottom="6"
            width="90%"
          >
            Are you sure you want to proceed?
          </DynamicText>

          <Box flexDirection="row" gap="3">
            <Button
              backgroundColor="buttonCasal"
              disabled={isCloseAccountLoading}
              flex={1}
              onPress={closeCancellationModal}
            >
              <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                No
              </Text>
            </Button>

            <Button
              backgroundColor="buttonNeutralDarker"
              disabled={isCloseAccountLoading}
              flex={1}
              onPress={logOut}
            >
              <Text color="red11" fontFamily="Halver-Semibold">
                Yes
              </Text>
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
