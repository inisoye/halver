import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { Box, Button, DynamicText, Modal, Text, TouchableOpacity } from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { deleteAxiosDefaultToken } from '@/lib/axios';
import { allMMKVKeys, storage } from '@/lib/mmkv';
import { isAndroid } from '@/utils';

export const LogOutModal: React.FunctionComponent = () => {
  const [_token, setToken] = useMMKVString(allMMKVKeys.token);

  const logOut = () => {
    setToken(undefined);
    storage.clearAll();
    deleteAxiosDefaultToken();
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
        backgroundColor="elementBackground"
        borderColor="borderDefault"
        borderRadius="md"
        flexDirection="row"
        gap="4"
        justifyContent="center"
        paddingHorizontal="4"
        paddingVertical="2"
        onPress={handleButtonPress}
      >
        <DynamicText
          color="red11"
          fontFamily="Halver-Semibold"
          numberOfLines={1}
          textAlign="center"
          variant="xs"
        >
          Log out
        </DynamicText>
      </TouchableOpacity>

      <Modal
        closeModal={closeCancellationModal}
        headingText="Are you sure?"
        isLoaderOpen={false}
        isModalOpen={isCancellationModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          paddingBottom={isAndroid() ? '6' : '8'}
          paddingHorizontal="6"
          paddingTop="6"
        >
          <DynamicText fontFamily="Halver-Semibold" marginBottom="6" width="70%">
            All your data and preferences on this phone will be deleted.
          </DynamicText>

          <Box flexDirection="row" gap="3">
            <Button
              backgroundColor="buttonCasal"
              flex={1}
              onPress={closeCancellationModal}
            >
              <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                No
              </Text>
            </Button>

            <Button backgroundColor="buttonNeutralDarker" flex={1} onPress={logOut}>
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
