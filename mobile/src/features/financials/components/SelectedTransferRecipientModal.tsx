import { AxiosError } from 'axios';
import * as React from 'react';

import { Box, Button, Image, Modal, Text } from '@/components';
import {
  convertKebabAndSnakeToTitleCase,
  getInitials,
  handleAxiosErrorAlertAndHaptics,
  isAndroid,
} from '@/utils';

import {
  useDeleteTransferRecipient,
  useSetDefaultTransferRecipient,
} from '../api';
import { TransferRecipient } from './TransferRecipientItem';

interface BankLogoProps {
  bankLogo: string | null | undefined;
  initials: string;
}

const BankLogo: React.FunctionComponent<BankLogoProps> = ({
  bankLogo,
  initials,
}) => {
  return bankLogo ? (
    <Image
      backgroundColor={bankLogo ? 'white' : 'bankImageBackground'}
      borderRadius="md"
      contentFit="contain"
      height={36}
      source={bankLogo}
      width={36}
    />
  ) : (
    <Box
      alignItems="center"
      backgroundColor="white"
      borderRadius="md"
      height={36}
      justifyContent="center"
      width={36}
    >
      <Text color="textBlack" fontFamily="Halver-Semibold" variant="sm">
        {initials}
      </Text>
    </Box>
  );
};

interface SelectedTransferRecipientModalProps {
  selectedTransferRecipient: TransferRecipient | undefined;
  closeModal: () => void;
  isModalOpen: boolean;
}

export const SelectedTransferRecipientModal: React.FunctionComponent<SelectedTransferRecipientModalProps> =
  React.memo(({ selectedTransferRecipient, closeModal, isModalOpen }) => {
    const {
      bankName: bankName,
      bankLogo,
      accountNumber,
      name: _accountName,
      isDefault,
      created,
    } = selectedTransferRecipient || {};

    const accountName = convertKebabAndSnakeToTitleCase(_accountName || '');
    const bankInitials = React.useMemo(() => getInitials(bankName), [bankName]);

    const {
      mutate: deleteTransferRecipient,
      isLoading: isDeleteTransferRecipientLoading,
    } = useDeleteTransferRecipient();
    const {
      mutate: setDefaultTransferRecipient,
      isLoading: isSetDefaultTransferRecipientLoading,
    } = useSetDefaultTransferRecipient();

    const onDeleteCard = () => {
      deleteTransferRecipient(selectedTransferRecipient?.recipientCode || '', {
        onSuccess: () => {
          closeModal();
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics(
            'Error deleting transfer recipient',
            error as AxiosError,
          );
        },
      });
    };

    const onSetDefaultCardSubmit = () => {
      setDefaultTransferRecipient(selectedTransferRecipient?.uuid || '', {
        onSuccess: () => {
          closeModal();
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics(
            'Error setting transfer recipient as default',
            error as AxiosError,
          );
        },
      });
    };

    return (
      <Modal
        closeModal={closeModal}
        headingComponent={
          <BankLogo bankLogo={bankLogo} initials={bankInitials} />
        }
        isLoaderOpen={
          isSetDefaultTransferRecipientLoading ||
          isDeleteTransferRecipientLoading
        }
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          maxHeight="81%"
          opacity={
            isSetDefaultTransferRecipientLoading ||
            isDeleteTransferRecipientLoading
              ? 0.6
              : 1
          }
          paddingBottom={isAndroid() ? '2' : '6'}
          paddingTop={isDefault ? undefined : '5'}
          pointerEvents={
            isSetDefaultTransferRecipientLoading ||
            isDeleteTransferRecipientLoading
              ? 'none'
              : undefined
          }
        >
          {isDefault && (
            <Box
              alignItems="center"
              backgroundColor="buttonPharlap"
              columnGap="3"
              flexDirection="row"
              marginBottom="5"
              paddingHorizontal="6"
              paddingVertical="1.5"
            >
              <Text
                color="buttonTextPharlap"
                fontFamily="Halver-Semibold"
                textAlign="center"
                variant="xs"
              >
                This is currently your default transfer recipient.
              </Text>
            </Box>
          )}

          <Box
            columnGap="6"
            flexDirection="row"
            flexWrap="wrap"
            marginBottom="3.5"
            paddingHorizontal="6"
          >
            <Box paddingVertical="2" width="46%">
              <Text
                color="textLight"
                marginBottom="0.75"
                numberOfLines={1}
                variant="xs"
              >
                Bank name
              </Text>

              <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
                {bankName}
              </Text>
            </Box>

            <Box
              opacity={accountNumber ? 1 : 0.5}
              paddingVertical="2"
              width="46%"
            >
              <Text
                color="textLight"
                marginBottom="0.75"
                numberOfLines={1}
                variant="xs"
              >
                Account number
              </Text>

              <Text
                color={accountNumber ? 'textDefault' : 'textLight'}
                fontFamily="Halver-Semibold"
                numberOfLines={1}
                variant="sm"
              >
                {accountNumber || 'Not recorded'}
              </Text>
            </Box>

            <Box
              opacity={accountName ? 1 : 0.5}
              paddingVertical="2"
              width="46%"
            >
              <Text
                color="textLight"
                marginBottom="0.75"
                numberOfLines={1}
                variant="xs"
              >
                Account name
              </Text>

              <Text
                color={accountName ? 'textDefault' : 'textLight'}
                fontFamily="Halver-Semibold"
                numberOfLines={1}
                variant="sm"
              >
                {accountName || 'Not recorded'}
              </Text>
            </Box>

            <Box opacity={created ? 1 : 0.5} paddingVertical="2" width="46%">
              <Text
                color="textLight"
                marginBottom="0.75"
                numberOfLines={1}
                variant="xs"
              >
                Date added
              </Text>

              <Text
                color={created ? 'textDefault' : 'textLight'}
                fontFamily="Halver-Semibold"
                numberOfLines={1}
                variant="sm"
              >
                {created ? new Date(created).toDateString() : 'Not recorded'}
              </Text>
            </Box>
          </Box>

          <Box
            flexDirection="row"
            gap="3"
            marginBottom="3"
            paddingHorizontal="6"
          >
            <Button
              backgroundColor="buttonNeutralDarker"
              disabled={
                isSetDefaultTransferRecipientLoading ||
                isDeleteTransferRecipientLoading
              }
              flex={1}
              paddingVertical="2.5"
              onPress={onDeleteCard}
            >
              <Text color="buttonTextDanger" fontFamily="Halver-Semibold">
                {isDeleteTransferRecipientLoading ? 'Loading' : 'Delete'}
              </Text>
            </Button>

            <Button
              backgroundColor="buttonCasal"
              disabled={
                isSetDefaultTransferRecipientLoading ||
                isDeleteTransferRecipientLoading ||
                isDefault
              }
              flex={1}
              paddingVertical="2.5"
              onPress={onSetDefaultCardSubmit}
            >
              <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                {isSetDefaultTransferRecipientLoading
                  ? 'Loading...'
                  : 'Set as default'}
              </Text>
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  });
