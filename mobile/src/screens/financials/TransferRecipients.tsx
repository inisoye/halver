import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
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
  prefetchBanks,
  SelectedTransferRecipientModal,
  TransferRecipientItem,
  useTransferRecipients,
  type TransferRecipient,
} from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { BankEmoji, CirclePlus, Plus } from '@/icons';
import type { FinancialsStackParamList } from '@/navigation';
import { gapStyles } from '@/theme';

type TransferRecipientsProps = NativeStackScreenProps<
  FinancialsStackParamList,
  'Transfer recipients'
>;

export const TransferRecipients: React.FunctionComponent<
  TransferRecipientsProps
> = ({ navigation }) => {
  const queryClient = useQueryClient();

  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const [selectedTransferRecipient, _setSelectedTransferRecipient] =
    React.useState<TransferRecipient | undefined>(undefined);

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

  const goToAddTransferRecipient = () => {
    prefetchBanks(queryClient);
    navigation.navigate('Add a recipient');
  };

  return (
    <>
      <SelectedTransferRecipientModal
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        selectedTransferRecipient={selectedTransferRecipient}
      />

      <Screen
        headerRightComponent={
          <TouchableOpacity
            hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
            onPress={goToAddTransferRecipient}
          >
            <Plus />
          </TouchableOpacity>
        }
      >
        <FullScreenLoader
          isVisible={areTransferRecipientsLoading}
          message="Loading transfer recipients..."
        />

        {!areTransferRecipientsLoading && (
          <Box flex={1} paddingVertical="2">
            {areThereRecipients ? (
              <DynamicText
                color="textLight"
                marginBottom="4"
                maxWidth="90%"
                paddingHorizontal="6"
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
                paddingHorizontal="6"
                variant="sm"
              >
                Transfer recipients are bank accounts used to receive payments
                on Halver. You currently have none added.
              </DynamicText>
            )}

            <ScrollView
              // eslint-disable-next-line react-native/no-inline-styles
              contentContainerStyle={[gapStyles[12], { paddingBottom: 4 }]}
              flexGrow={0}
              paddingHorizontal="6"
            >
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

            <Box paddingHorizontal="6">
              <TouchableOpacity
                alignItems="center"
                backgroundColor="inputBackground"
                borderRadius="base"
                columnGap="3"
                elevation={0.5}
                flexDirection="row"
                justifyContent="space-between"
                marginTop="3"
                mb="1"
                paddingHorizontal="4"
                paddingVertical="2.5"
                shadowColor="black"
                shadowOffset={{
                  width: 0.1,
                  height: 0.3,
                }}
                shadowOpacity={0.2}
                shadowRadius={0.3}
                onPress={goToAddTransferRecipient}
              >
                <Box
                  alignItems="center"
                  columnGap="2"
                  flexDirection="row"
                  width="70%"
                >
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
          </Box>
        )}
      </Screen>
    </>
  );
};
