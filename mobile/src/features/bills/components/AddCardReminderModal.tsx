import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, Button, DynamicText, Modal, Text } from '@/components';
import { GoToArrow } from '@/icons';
import type { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import { isAndroid } from '@/utils';

interface AddCardReminderModalProps {
  closeCardReminderModal: () => void;
  isCardReminderModalOpen: boolean;
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<BillsStackParamList, 'Bill Payment', undefined>,
    NativeStackNavigationProp<AppRootStackParamList, 'Bill Payment', undefined>
  >;
}

export const AddCardReminderModal: React.FunctionComponent<
  AddCardReminderModalProps
> = ({ closeCardReminderModal, isCardReminderModalOpen, navigation }) => {
  const goToAddCard = () => {
    closeCardReminderModal();
    navigation.navigate('Add your card');
  };

  return (
    <>
      <Modal
        closeModal={closeCardReminderModal}
        headingText="You'll need to add your card first"
        isLoaderOpen={false}
        isModalOpen={isCardReminderModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          paddingBottom={isAndroid() ? '6' : '8'}
          paddingHorizontal="6"
          paddingTop="6"
        >
          <DynamicText color="textLight" marginBottom="6" width="95%">
            To make a contribution towards a bill, you must have a valid default
            card on Halver.
          </DynamicText>

          <Box flexDirection="row" gap="3" marginBottom="3">
            <Button backgroundColor="buttonCasal" onPress={goToAddCard}>
              <Box
                flexDirection="row"
                gap="4"
                justifyContent="space-between"
                width="100%"
              >
                <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                  Add your card
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
