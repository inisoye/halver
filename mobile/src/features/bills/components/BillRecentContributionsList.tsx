import * as React from 'react';

import { Box, DynamicText, Modal, Text, TouchableOpacity } from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { RightCaret } from '@/icons';
import { convertNumberToNaira, isAndroid } from '@/utils';

import { BillTransaction, useBillTransactions } from '../api';

interface BillRecentContributionItemProps {
  openModal: () => void;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<BillTransaction | undefined>
  >;
  transaction: BillTransaction;
  isFirstItem: boolean;
}

const BillRecentContributionItem: React.FunctionComponent<
  BillRecentContributionItemProps
> = ({ openModal, setSelectedTransaction, transaction, isFirstItem }) => {
  const { contribution, payingUser, uuid, created } = transaction;

  const handleTransactionItemClick = () => {
    openModal();
    setSelectedTransaction(transaction);
  };

  return (
    <TouchableOpacity
      backgroundColor="elementBackground"
      borderColor="borderDefault"
      borderTopWidth={isFirstItem ? undefined : 0.5}
      flexDirection="row"
      gap="4"
      justifyContent="space-between"
      key={uuid}
      paddingVertical="2.5"
      px="4"
      onPress={handleTransactionItemClick}
    >
      <Box alignItems="center" flexDirection="row" gap="4">
        <Box gap="0.5">
          <Text fontFamily="Halver-Semibold" fontSize={13} variant="sm">
            From {payingUser?.firstName}
          </Text>

          <Text color="textLight" variant="xs">
            on {new Date(created).toDateString()}
          </Text>
        </Box>
      </Box>

      <DynamicText
        color="textLight"
        fontFamily="Halver-Semibold"
        textAlign="right"
        variant="xs"
        width="35%"
      >
        {convertNumberToNaira(Number(contribution))}
      </DynamicText>
    </TouchableOpacity>
  );
};

interface BillRecentContributionsListProps {
  id: string;
  isDiscreet: boolean | undefined;
}

export const BillRecentContributionsList: React.FunctionComponent<
  BillRecentContributionsListProps
> = ({ id, isDiscreet }) => {
  const { data: billTransactionsResponse, isLoading: areBillTransactionsLoading } =
    useBillTransactions(id);

  const [selectedTransaction, setSelectedTransaction] = React.useState<
    BillTransaction | undefined
  >(undefined);

  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const { results: billTransactions } = billTransactionsResponse || {};

  const noTransactions = !!billTransactions && billTransactions.length < 1;
  const isDisabled = isDiscreet || noTransactions || areBillTransactionsLoading;

  const { payingUser, created, receivingUser, contribution, totalPayment } =
    selectedTransaction || {};

  const modalHeading = `${payingUser?.firstName || 'Participant'}'s contribution`;

  return (
    <>
      <Modal
        closeModal={closeModal}
        headingText={modalHeading}
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          columnGap="6"
          flexDirection="row"
          flexWrap="wrap"
          maxHeight="81%"
          paddingBottom={isAndroid() ? '3' : '8'}
          paddingHorizontal="6"
          paddingTop="3.5"
          rowGap="1"
        >
          <Box paddingVertical="2" width="46.3%">
            <Text color="textLight" marginBottom="0.75" numberOfLines={1} variant="xs">
              Completed on
            </Text>

            <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
              {!!created && new Date(created).toDateString()}
            </Text>
          </Box>
          <Box paddingVertical="2" width="46.3%">
            <Text color="textLight" marginBottom="0.75" numberOfLines={1} variant="xs">
              Creditor
            </Text>

            <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
              {receivingUser?.fullName}
            </Text>
          </Box>
          <Box paddingVertical="2" width="46.3%">
            <Text color="textLight" marginBottom="0.75" numberOfLines={1} variant="xs">
              Amount
            </Text>

            <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
              {!!contribution && convertNumberToNaira(Number(contribution))}
            </Text>
          </Box>
          <Box paddingVertical="2" width="46.3%">
            <Text color="textLight" marginBottom="0.75" numberOfLines={1} variant="xs">
              Amount with fees
            </Text>
            <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
              {!!totalPayment && convertNumberToNaira(Number(totalPayment))}
            </Text>
          </Box>
        </Box>
      </Modal>

      {!areBillTransactionsLoading && (
        <>
          <Box
            alignItems="center"
            flexDirection="row"
            gap="4"
            justifyContent="space-between"
            marginBottom="3"
          >
            <Text fontFamily="Halver-Semibold" variant="xl">
              Recent contributions
            </Text>

            {!isDisabled && false && <RightCaret isDark />}
          </Box>

          {noTransactions && (
            <Box
              backgroundColor="elementBackground"
              borderRadius="lg"
              paddingHorizontal="4"
              paddingVertical="2.5"
            >
              <Text color="textLight" variant="sm">
                No one has made a contribution yet.
              </Text>
            </Box>
          )}

          <Box
            backgroundColor="elementBackground"
            borderRadius="md"
            elevation={0.5}
            shadowColor="black"
            shadowOffset={{
              width: 0.1,
              height: 0.3,
            }}
            shadowOpacity={0.2}
            shadowRadius={0.3}
          >
            <Box borderRadius="md" overflow="hidden">
              {billTransactions?.map((transaction, index) => {
                return (
                  <BillRecentContributionItem
                    isFirstItem={index === 0}
                    key={transaction.uuid}
                    openModal={openModal}
                    setSelectedTransaction={setSelectedTransaction}
                    transaction={transaction}
                  />
                );
              })}
            </Box>
          </Box>
        </>
      )}
    </>
  );
};
