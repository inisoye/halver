import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  Box,
  FullWidthTextField,
  LogoLoader,
  RectButton,
  Screen,
  Text,
} from '@/components';
import type { BillTransaction } from '@/features/bills';
import { SelectedTransactionModal, useUserTransactions } from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { RightCaret, Search } from '@/icons';
import { AppRootStackParamList, FinancialsStackParamList } from '@/navigation';
import { formatNumberWithCommas, useIsDarkMode } from '@/utils';

interface TransactionItemProps {
  handleTransactionSelection: (transaction: BillTransaction | undefined) => void;
  index: number;
  item: BillTransaction | undefined;
}

const TransactionItem: React.FunctionComponent<TransactionItemProps> = ({
  handleTransactionSelection,
  index,
  item,
}) => {
  const isDarkMode = useIsDarkMode();

  const { contribution, created, isCredit, payingUser, bill, receivingUser } =
    item || {};
  const { name: billName } = bill || {};
  const { firstName: payingUserName } = payingUser || {};
  const { firstName: receivingUserName } = receivingUser || {};

  const onPress = () => {
    handleTransactionSelection(item);
  };

  return (
    <RectButton
      activeOpacity={0.05}
      marginTop={index === 0 ? '4' : '1'}
      underlayColor={isDarkMode ? 'white' : 'black'}
      onPress={onPress}
    >
      <Box
        accessibilityRole="button"
        alignItems="center"
        flexDirection="row"
        gap="4"
        justifyContent="space-between"
        paddingHorizontal="6"
        paddingVertical="3.5"
      >
        <Box alignItems="center" flexDirection="row" gap="3">
          <Box width="92%">
            <Text fontFamily="Halver-Semibold" marginBottom="0.75" numberOfLines={1}>
              <Text fontFamily="Halver-Naira">₦</Text>
              {formatNumberWithCommas(Number(contribution))} on {billName}
            </Text>
            <Text
              color="textLight"
              fontFamily="Halver-Semibold"
              numberOfLines={1}
              variant="xs"
            >
              <Text
                color={isCredit ? 'green11' : 'brown11'}
                fontFamily="Halver-Semibold"
                variant="xs"
              >
                {isCredit ? 'Credit' : 'Debit'}
              </Text>
              {' • '}
              From {isCredit ? payingUserName : 'you'} to
              {isCredit ? ' you • ' : ` ${receivingUserName} • `}
              <Text color="textLight" fontFamily="Halver-Semibold" variant="xs">
                {!!created && new Date(created).toDateString()}
              </Text>
            </Text>
          </Box>
        </Box>

        <RightCaret />
      </Box>
    </RectButton>
  );
};

type TransactionsProps = CompositeScreenProps<
  NativeStackScreenProps<FinancialsStackParamList, 'Transactions'>,
  NativeStackScreenProps<AppRootStackParamList>
>;

export const Transactions: React.FunctionComponent<TransactionsProps> = ({
  navigation,
}) => {
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const [selectedTransaction, setSelectedTransaction] = React.useState<
    BillTransaction | undefined
  >(undefined);

  const { control: controlForTransactionsFilter } = useForm<{
    transactionsFilter: string;
  }>({
    defaultValues: {
      transactionsFilter: '',
    },
  });

  const transactionsFilterValue = useWatch({
    control: controlForTransactionsFilter,
    name: 'transactionsFilter',
  });

  const { data: transactionsResponse, isLoading: areTransactionsLoading } =
    useUserTransactions();

  const { results: transactions } = transactionsResponse ?? {};

  const noTransactionsFound =
    !areTransactionsLoading && (!transactions || transactions?.length < 1);

  const handleTransactionSelection = React.useCallback(
    (transaction: BillTransaction | undefined) => {
      setSelectedTransaction(transaction);
      openModal();
    },
    [openModal],
  );

  const renderItem: ListRenderItem<BillTransaction | undefined> = ({ item, index }) => {
    return (
      <TransactionItem
        handleTransactionSelection={handleTransactionSelection}
        index={index}
        item={item}
      />
    );
  };

  return (
    <>
      <SelectedTransactionModal
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        navigation={navigation}
        selectedTransaction={selectedTransaction}
      />

      <Screen headerProps={{ paddingBottom: '1' }}>
        <Box backgroundColor="transparent" height={12}>
          {areTransactionsLoading && <LogoLoader />}
        </Box>

        <FullWidthTextField
          autoFocus={false}
          containerProps={{ marginTop: '0' }}
          control={controlForTransactionsFilter}
          name="transactionsFilter"
          paddingHorizontal="0"
          paddingRight="6"
          placeholder="Search by bill, participant or creditor"
          prefixComponent={<Search />}
        />

        {noTransactionsFound && (
          <Text color="textLight" padding="6">
            We found no transactions
            {!!transactionsFilterValue && ` matching "${transactionsFilterValue}"`}
          </Text>
        )}

        <FlashList
          data={transactions}
          estimatedItemSize={200}
          renderItem={renderItem}
        />
      </Screen>
    </>
  );
};
