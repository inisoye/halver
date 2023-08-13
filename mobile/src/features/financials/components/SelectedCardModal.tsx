import { AxiosError } from 'axios';
import * as React from 'react';

import { Box, Button, DynamicText, Modal, Text } from '@/components';
import {
  convertKebabAndSnakeToTitleCase,
  generateRedactedCardDigits,
  handleAxiosErrorAlertAndHaptics,
} from '@/utils';

import { useDeleteCard, useSetDefaultCard } from '../api';
import { CardIcon } from './CardIcon';
import type { Card } from './CardItem';

interface SelectedCardModalProps {
  selectedCard: Card | undefined;
  closeModal: () => void;
  isModalOpen: boolean;
}

export const SelectedCardModal: React.FunctionComponent<SelectedCardModalProps> =
  React.memo(({ selectedCard, closeModal, isModalOpen }) => {
    const { bank, accountName, cardType, first6, last4 } = selectedCard || {};
    const bankName = convertKebabAndSnakeToTitleCase(bank);

    const cardDigits = React.useMemo(
      () => generateRedactedCardDigits(first6 || '', last4 || ''),
      [first6, last4],
    );

    const { mutate: deleteCard, isLoading: isDeleteCardLoading } = useDeleteCard();
    const { mutate: setDefaultCard, isLoading: isSetDefaultCardLoading } =
      useSetDefaultCard();

    const onSetDefaultCardSubmit = () => {
      setDefaultCard(selectedCard?.uuid || '', {
        onSuccess: () => {
          closeModal();
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics(
            'Error setting card as default',
            error as AxiosError,
          );
        },
      });
    };

    const onDeleteCard = () => {
      deleteCard(selectedCard?.uuid || '', {
        onSuccess: () => {
          closeModal();
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics('Error deleting card', error as AxiosError);
        },
      });
    };

    return (
      <Modal
        closeModal={closeModal}
        headingText={`${bankName} ${convertKebabAndSnakeToTitleCase(
          cardType,
        )?.trim()} card`}
        isLoaderOpen={isSetDefaultCardLoading || isDeleteCardLoading}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          maxHeight="81%"
          paddingBottom="8"
          paddingTop="3.5"
        >
          <Box
            columnGap="6"
            flexDirection="row"
            flexWrap="wrap"
            marginBottom="3.5"
            paddingHorizontal="6"
          >
            <Box paddingVertical="2" width="46.3%">
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
            <Box opacity={accountName ? 1 : 0.5} paddingVertical="2" width="46.3%">
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
          </Box>

          <DynamicText
            color="textLight"
            marginBottom="0.75"
            numberOfLines={1}
            paddingHorizontal="6"
            variant="xs"
          >
            Card number
          </DynamicText>
          <Box
            alignItems="center"
            backgroundColor="grayA11"
            columnGap="3"
            flexDirection="row"
            justifyContent="space-between"
            marginBottom="6"
            paddingHorizontal="6"
            paddingVertical="2.5"
          >
            <Box columnGap="3" flexDirection="row" maxWidth="80%">
              {cardDigits.map(digits => {
                return (
                  <Text color="textInverse" fontFamily="Halver-Semibold" key={digits}>
                    {digits}
                  </Text>
                );
              })}
            </Box>

            <CardIcon type={cardType} />
          </Box>

          <Box flexDirection="row" gap="3" marginBottom="3" paddingHorizontal="6">
            <Button
              backgroundColor="buttonNeutralDarker"
              disabled={isSetDefaultCardLoading || isDeleteCardLoading}
              flex={1}
              onPress={onDeleteCard}
            >
              <Text color="buttonTextDanger" fontFamily="Halver-Semibold">
                {isDeleteCardLoading ? 'Loading' : 'Delete card'}
              </Text>
            </Button>

            <Button
              backgroundColor="buttonCasal"
              disabled={isSetDefaultCardLoading || isDeleteCardLoading}
              flex={1}
              onPress={onSetDefaultCardSubmit}
            >
              <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                {isSetDefaultCardLoading ? 'Loading...' : 'Set as default'}
              </Text>
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  });
