import * as SMS from 'expo-sms';
import * as React from 'react';
import { Share } from 'react-native';

import { Box, Button, Modal, Text, TouchableOpacity } from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { ShareArrow } from '@/icons';
import { isAndroid } from '@/utils';

import { BillDetailAction } from '../types';

interface SMSButtonProps {
  billName: string;
  unregisteredPhoneNumbersList: string[];
}

const SMSButton: React.FunctionComponent<SMSButtonProps> = ({
  billName,
  unregisteredPhoneNumbersList,
}) => {
  const [isSMSAvailable, setIsSMSAvailable] = React.useState(false);

  const handleComposeMessage = React.useCallback(async () => {
    if (isSMSAvailable) {
      await SMS.sendSMSAsync(
        unregisteredPhoneNumbersList,
        `Hi! You have been invited to join a bill (${billName}) on Halver. Go to https://www.halverapp.com/ to join Halver and make your contribution. Make sure you use this phone number to register. Thanks!`,
      );
    }
  }, [isSMSAvailable, unregisteredPhoneNumbersList, billName]);

  React.useEffect(() => {
    SMS.isAvailableAsync().then(setIsSMSAvailable);
  }, []);

  return (
    <Button
      backgroundColor="buttonNeutralDarker"
      disabled={false}
      flex={1}
      onPress={handleComposeMessage}
    >
      <Text color="buttonTextNeutral" fontFamily="Halver-Semibold">
        SMS
      </Text>
    </Button>
  );
};

interface ShareButtonProps {
  billName: string;
}

const ShareButton: React.FunctionComponent<ShareButtonProps> = ({
  billName,
}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hi! You have been invited to join a bill (${billName}) on Halver. Go to https://www.halverapp.com/ to join Halver and make your contribution. Thanks!`,
      });
    } catch (error) {}
  };

  return (
    <Button
      backgroundColor="buttonCasal"
      disabled={false}
      flex={1}
      onPress={handleShare}
    >
      <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
        Share
      </Text>
    </Button>
  );
};

const hitSlop = {
  top: 10,
  right: 40,
  bottom: 10,
  left: 40,
};

interface ShareBillModalProps {
  actions: BillDetailAction[] | undefined;
  billName: string;
}

export const ShareBillModal: React.FunctionComponent<ShareBillModalProps> = ({
  actions,
  billName,
}) => {
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const unregisteredPhoneNumbersList =
    actions
      ?.filter(action => action.status === 'unregistered')
      ?.map(action => action.unregisteredParticipant.phone) ?? [];

  return (
    <>
      <TouchableOpacity hitSlop={hitSlop} onPress={openModal}>
        <ShareArrow />
      </TouchableOpacity>

      <Modal
        closeModal={closeModal}
        headingText="Share bill"
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          maxHeight="81%"
          paddingBottom={isAndroid() ? '6' : '8'}
          paddingHorizontal="6"
          paddingTop="6"
        >
          <Text fontFamily="Halver-Semibold" marginBottom="3" variant="lg">
            Select a sharing option
          </Text>
          <Text color="textLight" marginBottom="6" variant="sm">
            Please ensure participants use the phone numbers on this bill to
            register. Registering with incorrect numbers will lead to exclusion
            from the bill.
          </Text>

          <Box marginBottom="2">
            <Box flexDirection="row" gap="3">
              <SMSButton
                billName={billName}
                unregisteredPhoneNumbersList={unregisteredPhoneNumbersList}
              />

              <ShareButton billName={billName} />
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
