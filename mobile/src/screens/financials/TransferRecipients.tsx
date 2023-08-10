import * as React from 'react';

import {
  Box,
  DynamicText,
  FullScreenLoader,
  Image,
  Screen,
  ScrollView,
  Text,
  TouchableOpacity,
} from '@/components';
import { useTransferRecipients } from '@/features/financials';
import { BankEmoji, CirclePlus } from '@/icons';
import { gapStyles } from '@/theme';
import { convertKebabAndSnakeToTitleCase, getInitials } from '@/utils';

interface TransferRecipientItemProps {
  bankName: string | null | undefined;
  bankLogo: string | null | undefined;
  accountNumber: string | null | undefined;
  isDefault: boolean | undefined;
  accountName: string;
  uuid: string;
}

const TransferRecipientItem: React.FunctionComponent<TransferRecipientItemProps> =
  React.memo(({ bankLogo, bankName, accountName, accountNumber, isDefault, uuid }) => {
    const initials = React.useMemo(() => getInitials(bankName), [bankName]);
    const formattedAccountName = React.useMemo(
      () => convertKebabAndSnakeToTitleCase(accountName),
      [accountName],
    );

    return (
      <TouchableOpacity
        backgroundColor="elementBackground"
        borderRadius="base"
        key={uuid}
        paddingHorizontal="4"
        paddingVertical="4"
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
              borderRadius="md"
              contentFit="contain"
              height={24}
              source={bankLogo}
              width={24}
            />
          ) : (
            <Box
              alignItems="center"
              backgroundColor="white"
              borderRadius="md"
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
            <Box
              // alignSelf="flex-end"
              backgroundColor="defaultItemTagBg"
              borderRadius="base"
              px="2"
              py="1"
            >
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

export const TransferRecipients: React.FunctionComponent = () => {
  const { data: transferRecipients, isLoading: areTransferRecipientsLoading } =
    useTransferRecipients();

  // Place default card before others.
  const sortedTransferRecipients = React.useMemo(
    () =>
      transferRecipients?.sort((a, b) =>
        a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1,
      ),
    [transferRecipients],
  );

  const areThereRecipients =
    !areTransferRecipientsLoading &&
    !!sortedTransferRecipients &&
    sortedTransferRecipients?.length > 0;
  const onlyOneRecipientAvailable = sortedTransferRecipients?.length === 1;

  return (
    <Screen>
      <FullScreenLoader
        isVisible={areTransferRecipientsLoading}
        message="Loading transfer recipients..."
      />

      {!areTransferRecipientsLoading && (
        <Box flex={1} paddingHorizontal="6" paddingVertical="2">
          {areThereRecipients ? (
            <DynamicText color="textLight" marginBottom="4" maxWidth="90%" variant="sm">
              {onlyOneRecipientAvailable
                ? 'Transfer recipients are bank accounts used to receive payments on Halver. You have only one added.'
                : 'Transfer recipients are bank accounts used to receive payments on Halver.'}
            </DynamicText>
          ) : (
            <DynamicText color="textLight" marginBottom="4" maxWidth="90%" variant="sm">
              Transfer recipients are bank accounts used to receive payments on Halver.
              You currently have none added.
            </DynamicText>
          )}

          <ScrollView contentContainerStyle={gapStyles[12]} flexGrow={0}>
            {sortedTransferRecipients?.map(
              ({ name, uuid, bankName, accountNumber, bankLogo, isDefault }) => {
                return (
                  <TransferRecipientItem
                    accountName={name}
                    accountNumber={accountNumber}
                    bankLogo={bankLogo}
                    bankName={bankName}
                    isDefault={isDefault}
                    key={uuid}
                    uuid={uuid}
                  />
                );
              },
            )}
          </ScrollView>

          <TouchableOpacity
            alignItems="center"
            backgroundColor="elementBackground"
            borderRadius="base"
            columnGap="3"
            flexDirection="row"
            justifyContent="space-between"
            marginTop="3"
            mb="1"
            paddingHorizontal="4"
            paddingVertical="2.5"
          >
            <Box alignItems="center" columnGap="2" flexDirection="row" width="70%">
              <BankEmoji height={24} width={24} />

              <DynamicText
                color="textLight"
                fontFamily="Halver-Semibold"
                marginLeft="1"
                numberOfLines={1}
                variant="sm"
                width="90%"
              >
                Add a new transfer recipient
              </DynamicText>
            </Box>

            <CirclePlus />
          </TouchableOpacity>
        </Box>
      )}
    </Screen>
  );
};
