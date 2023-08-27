import type { AxiosError } from 'axios';
import * as Haptics from 'expo-haptics';
import * as React from 'react';

import { Box, Button, DynamicText, Modal, Text, TouchableOpacity } from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { handleAxiosErrorAlertAndHaptics } from '@/utils';

import { useBill, useCancelBill } from '../api';

interface CancelBillModalProps {
  billId: string;
}

export const CancelBillModal: React.FunctionComponent<CancelBillModalProps> = ({
  billId,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const {
    state: isCancellationModalOpen,
    setTrue: openCancellationModal,
    setFalse: closeCancellationModal,
  } = useBooleanStateControl();

  const { mutate: cancelBill, isLoading: isCancellationLoading } = useCancelBill();

  const { refetch: refetchBill } = useBill(billId);

  const handleButtonPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    openCancellationModal();
  };

  const handleCancellation = () => {
    cancelBill(
      {
        id: String(billId),
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
        marginBottom="10"
        marginTop="60"
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
          Cancel this bill
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
          <DynamicText fontFamily="Halver-Semibold" marginBottom="3" width="80%">
            No participants will be able to make further contributions if you cancel.
          </DynamicText>
          <DynamicText color="textLight" marginBottom="6" variant="sm" width="70%">
            A bill cancellation is permanent and cannot be reversed.
          </DynamicText>

          <Box flexDirection="row" gap="3">
            <Button
              backgroundColor="buttonCasal"
              disabled={isCancellationLoading}
              flex={1}
              onPress={closeCancellationModal}
            >
              <Text fontFamily="Halver-Semibold">No</Text>
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
