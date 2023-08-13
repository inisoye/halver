import * as React from 'react';
import { z } from 'zod';

import { Box, DynamicText, Image, Text, TouchableOpacity } from '@/components';
import { TransferRecipient as TransferRecipientSchema } from '@/lib/zod';
import { convertKebabAndSnakeToTitleCase, getInitials } from '@/utils';

export type TransferRecipient = z.infer<typeof TransferRecipientSchema>;

interface TransferRecipientItemProps {
  recipient: TransferRecipient;
  openModal: () => void;
  setSelectedTransferRecipient: (recipient: TransferRecipient) => void;
}

export const TransferRecipientItem: React.FunctionComponent<TransferRecipientItemProps> =
  React.memo(({ recipient, openModal, setSelectedTransferRecipient }) => {
    const {
      bankLogo,
      bankName,
      name: accountName,
      accountNumber,
      isDefault,
      uuid,
    } = recipient || {};

    const initials = React.useMemo(() => getInitials(bankName), [bankName]);
    const formattedAccountName = React.useMemo(
      () => convertKebabAndSnakeToTitleCase(accountName),
      [accountName],
    );

    const openRecipientDetails = (): void => {
      setSelectedTransferRecipient(recipient);
      openModal();
    };

    return (
      <TouchableOpacity
        backgroundColor="elementBackground"
        borderRadius="base"
        key={uuid}
        paddingHorizontal="4"
        paddingVertical="4"
        onPress={openRecipientDetails}
      >
        <Box
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          mb="3"
        >
          {bankLogo ? (
            <Image
              backgroundColor={bankLogo ? 'white' : 'bankImageBackground'}
              borderRadius="base"
              contentFit="contain"
              height={24}
              source={bankLogo}
              width={24}
            />
          ) : (
            <Box
              alignItems="center"
              backgroundColor="white"
              borderRadius="base"
              height={24}
              justifyContent="center"
              width={24}
            >
              <Text color="textBlack" fontFamily="Halver-Semibold" variant="sm">
                {initials}
              </Text>
            </Box>
          )}

          {isDefault && (
            <Box backgroundColor="defaultItemTagBg" borderRadius="base" px="2" py="1">
              <DynamicText color="textWhite" fontFamily="Halver-Semibold" variant="xxs">
                Default
              </DynamicText>
            </Box>
          )}
        </Box>

        <DynamicText fontFamily="Halver-Semibold" marginBottom="1" numberOfLines={1}>
          {!!bankName && bankName}
        </DynamicText>

        <DynamicText
          color="textLight"
          fontFamily="Halver-Semibold"
          marginBottom="0.75"
          numberOfLines={1}
          variant="xs"
        >
          Account name: {formattedAccountName}
        </DynamicText>

        <DynamicText
          color="textLight"
          fontFamily="Halver-Semibold"
          numberOfLines={1}
          variant="xs"
        >
          Account number: {accountNumber}
        </DynamicText>
      </TouchableOpacity>
    );
  });
