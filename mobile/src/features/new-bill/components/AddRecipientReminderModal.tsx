import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, Button, DynamicText, Modal, Text } from '@/components';
import { GoToArrow } from '@/icons';
import type { AppRootStackParamList } from '@/navigation';
import { isAndroid } from '@/utils';

interface AddRecipientReminderModalProps {
  closeRecipientReminderModal: () => void;
  isRecipientReminderModalOpen: boolean;
  navigation: NativeStackNavigationProp<
    AppRootStackParamList,
    'Bill Details',
    undefined
  >;
}

export const AddRecipientReminderModal: React.FunctionComponent<
  AddRecipientReminderModalProps
> = ({
  closeRecipientReminderModal,
  isRecipientReminderModalOpen,
  navigation,
}) => {
  const goToAddRecipient = () => {
    closeRecipientReminderModal();
    navigation.navigate('Add a recipient');
  };

  return (
    <>
      <Modal
        closeModal={closeRecipientReminderModal}
        headingText="You'll need to add your bank account first"
        isLoaderOpen={false}
        isModalOpen={isRecipientReminderModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          paddingBottom={isAndroid() ? '6' : '8'}
          paddingHorizontal="6"
          paddingTop="6"
        >
          <DynamicText color="textLight" marginBottom="6" width="95%">
            Your bank account (transfer recipient) is where all contributions to
            your bill will be sent.
          </DynamicText>

          <Box flexDirection="row" gap="3" marginBottom="3">
            <Button backgroundColor="buttonCasal" onPress={goToAddRecipient}>
              <Box
                flexDirection="row"
                gap="4"
                justifyContent="space-between"
                width="100%"
              >
                <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                  Add your bank account
                </Text>

                <GoToArrow isLight />
              </Box>
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
