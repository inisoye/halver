import * as React from 'react';

import {
  Box,
  DynamicText,
  FullScreenLoader,
  Screen,
  ScrollView,
  TouchableOpacity,
} from '@/components';
import {
  SelectedTransferRecipientModal,
  TransferRecipientItem,
  useTransferRecipients,
  type TransferRecipient,
} from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { BankEmoji, CirclePlus } from '@/icons';
import { gapStyles } from '@/theme';

export const TransferRecipients: React.FunctionComponent = () => {
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const [selectedTransferRecipient, _setSelectedTransferRecipient] = React.useState<
    TransferRecipient | undefined
  >(undefined);

  const setSelectedTransferRecipient = React.useCallback(
    (recipient: TransferRecipient) => {
      _setSelectedTransferRecipient(recipient);
    },
    [],
  );

  const { data: transferRecipients, isLoading: areTransferRecipientsLoading } =
    useTransferRecipients();

  // Place default recipient before others.
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
    <>
      <SelectedTransferRecipientModal
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        selectedTransferRecipient={selectedTransferRecipient}
      />

      <Screen>
        <FullScreenLoader
          isVisible={areTransferRecipientsLoading}
          message="Loading transfer recipients..."
        />

        {!areTransferRecipientsLoading && (
          <Box flex={1} paddingHorizontal="6" paddingVertical="2">
            {areThereRecipients ? (
              <DynamicText
                color="textLight"
                marginBottom="4"
                maxWidth="90%"
                variant="sm"
              >
                {onlyOneRecipientAvailable
                  ? 'Transfer recipients are bank accounts used to receive payments on Halver. You have only one added.'
                  : 'Transfer recipients are bank accounts used to receive payments on Halver.'}
              </DynamicText>
            ) : (
              <DynamicText
                color="textLight"
                marginBottom="4"
                maxWidth="90%"
                variant="sm"
              >
                Transfer recipients are bank accounts used to receive payments on
                Halver. You currently have none added.
              </DynamicText>
            )}

            <ScrollView contentContainerStyle={gapStyles[12]} flexGrow={0}>
              {sortedTransferRecipients?.map(recipient => {
                return (
                  <TransferRecipientItem
                    key={recipient.uuid}
                    openModal={openModal}
                    recipient={recipient}
                    setSelectedTransferRecipient={setSelectedTransferRecipient}
                  />
                );
              })}
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
    </>
  );
};
