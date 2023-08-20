import * as React from 'react';

import { Box, DynamicText, Text, TouchableOpacity } from '@/components';
import { BillTransaction } from '@/features/bills';
import { useUserTransactions } from '@/features/financials';
import { convertNumberToNaira } from '@/utils';

interface TransactionItemProps {
  transaction: BillTransaction;
  isFirstItem: boolean;
  goToAllTransactions: () => void;
}

const TransactionItem: React.FunctionComponent<TransactionItemProps> = ({
  transaction,
  goToAllTransactions,
}) => {
  const {
    contribution,
    isCredit,
    uuid,
    created,
    bill: { name: billName },
  } = transaction;

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
      onPress={goToAllTransactions}
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

interface RecentTransactionsProps {
  goToAllTransactions: () => void;
}

export const RecentTransactions: React.FunctionComponent<RecentTransactionsProps> = ({
  goToAllTransactions,
}) => {
  const { data: transactionsResponse, isLoading: areTransactionsLoading } =
    useUserTransactions();

  const { results: transactions } = transactionsResponse || {};

  const noTransactions = !!transactions && transactions.length < 1;

  return (
    !areTransactionsLoading && (
      <Box>
        <DynamicText fontFamily="Halver-Semibold" marginBottom="3" variant="xl">
          Recent transactions
        </DynamicText>

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
                goToAllTransactions={goToAllTransactions}
                isFirstItem={index === 0}
                key={transaction.uuid}
                transaction={transaction}
              />
            );
          })}
        </Box>
      </Box>
    )
  );
};
