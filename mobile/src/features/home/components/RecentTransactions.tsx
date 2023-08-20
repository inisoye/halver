import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, DynamicText, Text, TouchableOpacity } from '@/components';
import { BillTransaction } from '@/features/bills';
import { useUserTransactions } from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { RightCaret } from '@/icons';
import { AppRootStackParamList, TabParamList } from '@/navigation';
import { convertNumberToNaira } from '@/utils';

import { SelectedTransactionModal } from './SelectedTransactionModal';

interface TransactionItemProps {
  transaction: BillTransaction;
  isFirstItem: boolean;
  handleTransactionSelection: (transaction: BillTransaction | undefined) => void;
}

const TransactionItem: React.FunctionComponent<TransactionItemProps> = ({
  transaction,
  handleTransactionSelection,
}) => {
  const {
    contribution,
    isCredit,
    uuid,
    created,
    bill: { name: billName },
  } = transaction;

  const onPress = () => {
    handleTransactionSelection(transaction);
  };

  return (
    <TouchableOpacity
      backgroundColor="elementBackground"
      borderRadius="md"
      elevation={1}
      flexDirection="row"
      gap="2"
      justifyContent="space-between"
      key={uuid}
      paddingVertical="3.5"
      px="4"
      shadowOffset={{
        width: 0.1,
        height: 0.3,
      }}
      shadowOpacity={0.2}
      shadowRadius={0.3}
      onPress={onPress}
    >
      <Box gap="0.75" width="60%">
        <DynamicText fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
          {billName}
        </DynamicText>

        <Text color="textLight" variant="xs">
          <Text
            color={isCredit ? 'green11' : 'brown11'}
            fontFamily="Halver-Semibold"
            variant="xs"
          >
            {isCredit ? 'Credit' : 'Debit'}
          </Text>
          {' • '}
          {new Date(created).toDateString()}
        </Text>
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

const hitSlop = {
  top: 10,
  right: 40,
  bottom: 10,
  left: 40,
};

interface RecentTransactionsProps {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<AppRootStackParamList, 'Home', undefined>,
    BottomTabNavigationProp<TabParamList, 'HomeStackNavigator', undefined>
  >;
  goToAllTransactions: () => void;
}

export const RecentTransactions: React.FunctionComponent<RecentTransactionsProps> = ({
  navigation,
  goToAllTransactions,
}) => {
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const [selectedTransaction, setSelectedTransaction] = React.useState<
    BillTransaction | undefined
  >(undefined);

  const { data: transactionsResponse, isLoading: areTransactionsLoading } =
    useUserTransactions();

  const { results: transactions } = transactionsResponse || {};

  const noTransactions = !!transactions && transactions.length < 1;

  const handleTransactionSelection = React.useCallback(
    (transaction: BillTransaction | undefined) => {
      setSelectedTransaction(transaction);
      openModal();
    },
    [openModal],
  );

  return (
    <>
      <SelectedTransactionModal
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        navigation={navigation}
        selectedTransaction={selectedTransaction}
      />

      {!areTransactionsLoading && (
        <Box>
          <TouchableOpacity
            alignItems="center"
            flexDirection="row"
            gap="4"
            hitSlop={hitSlop}
            justifyContent="space-between"
            marginBottom="3"
            onPress={goToAllTransactions}
          >
            <Text fontFamily="Halver-Semibold" variant="xl">
              Recent transactions
            </Text>

            <RightCaret isDark />
          </TouchableOpacity>

          {noTransactions && (
            <Box
              backgroundColor="elementBackground"
              borderRadius="lg"
              paddingHorizontal="4"
              paddingVertical="2.5"
            >
              <Text color="textLight" variant="sm">
                You have no transactions yet.
              </Text>
            </Box>
          )}

          <Box gap="3" mb="2">
            {transactions?.slice(0, 5).map((transaction, index) => {
              return (
                <TransactionItem
                  handleTransactionSelection={handleTransactionSelection}
                  isFirstItem={index === 0}
                  key={transaction.uuid}
                  transaction={transaction}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
};
