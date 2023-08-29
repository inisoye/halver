import type { AxiosError } from 'axios';
import * as Haptics from 'expo-haptics';
import * as React from 'react';

import { Box, Button, DynamicText, Modal, Text, TouchableOpacity } from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { handleAxiosErrorAlertAndHaptics } from '@/utils';

import { useBill, useCancelBillSubcscription } from '../api';

interface CancelSubscriptionModalProps {
  actionId: string | undefined;
  billId: string;
  billName: string;
}

export const CancelSubscriptionModal: React.FunctionComponent<
  CancelSubscriptionModalProps
> = ({ actionId, billId, billName }) => {
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const {
    state: isCancellationModalOpen,
    setTrue: openCancellationModal,
    setFalse: closeCancellationModal,
  } = useBooleanStateControl();

  const { mutate: cancelBillSubscription, isLoading: isCancellationLoading } =
    useCancelBillSubcscription();

  const { refetch: refetchBill } = useBill(billId);

  const handleButtonPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    openCancellationModal();
  };

  const handleCancellation = () => {
    cancelBillSubscription(
      {
        id: String(actionId),
      },
      {
        onSuccess: () => {
          // Disable button so it is not clickable before new, updated bill data is fetched.
          setIsButtonDisabled(true);
          refetchBill();
          closeCancellationModal();
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics(
            'Error cancelling subscription',
            error as AxiosError,
          );
        },
      },
    );
  };

  return (
    <>
      <TouchableOpacity
        alignItems="center"
        alignSelf="center"
        backgroundColor="elementBackground"
        borderColor="borderDefault"
        borderRadius="md"
        disabled={isButtonDisabled}
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
          Cancel your subscription
        </DynamicText>
      </TouchableOpacity>

      <Modal
        closeModal={closeCancellationModal}
        headingText="Are you sure?"
        isLoaderOpen={isCancellationLoading}
        isModalOpen={isCancellationModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          opacity={isCancellationLoading ? 0.6 : 1}
          paddingBottom="10"
          paddingHorizontal="6"
          paddingTop="6"
          pointerEvents={isCancellationLoading ? 'none' : undefined}
        >
          <Text fontFamily="Halver-Semibold" marginBottom="3">
            Ending your subscription on "{billName}" is permanent and cannot be
            reversed.
          </Text>
          <DynamicText color="textLight" marginBottom="6" variant="sm" width="80%">
            Click "yes" below only if you are sure you want to proceed.
          </DynamicText>

          <Box flexDirection="row" gap="3">
            <Button
              backgroundColor="buttonCasal"
              disabled={isCancellationLoading}
              flex={1}
              onPress={closeCancellationModal}
            >
              <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                No
              </Text>
            </Button>

            <Button
              backgroundColor="buttonNeutralDarker"
              disabled={isCancellationLoading}
              flex={1}
              onPress={handleCancellation}
            >
              <Text color="red11" fontFamily="Halver-Semibold">
                {isCancellationLoading ? 'Loading...' : 'Yes'}
              </Text>
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
