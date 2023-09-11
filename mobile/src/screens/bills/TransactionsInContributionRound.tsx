import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Box, DynamicText, LogoLoader, RectButton, Screen, Text } from '@/components';
import { useBillTransactionsOnDay, type BillTransaction } from '@/features/bills';
import { SelectedTransactionModal } from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { RightCaret } from '@/icons';
import { Theme } from '@/lib/restyle';
import {
  AppRootStackParamList,
  FinancialsStackParamList,
  HomeStackParamList,
} from '@/navigation';
import { flexStyles } from '@/theme';
import { formatNumberWithCommas, useIsDarkModeSelected } from '@/utils';

interface TransactionItemProps {
  handleTransactionSelection: (transaction: BillTransaction | undefined) => void;
  index: number;
  item: BillTransaction | undefined;
}

const TransactionItem: React.FunctionComponent<TransactionItemProps> = ({
  handleTransactionSelection,

  item,
}) => {
  const isDarkMode = useIsDarkModeSelected();
  const { colors } = useTheme<Theme>();

  const { contribution, created, payingUser, transactionType } = item || {};
  const { firstName: payingUserName } = payingUser || {};

  const onPress = () => {
    handleTransactionSelection(item);
  };

  return (
    <RectButton
      activeOpacity={0.05}
      rippleColor={colors.defaultListRippleBackground}
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
              {formatNumberWithCommas(Number(contribution))} by {payingUserName}
            </Text>
            <Text
              color="textLight"
              fontFamily="Halver-Semibold"
              numberOfLines={1}
              variant="xs"
            >
              <Text
                color={transactionType === 'regular' ? 'green11' : 'textApricot'}
                fontFamily="Halver-Semibold"
                variant="xs"
              >
                {transactionType === 'regular' ? 'Regular' : 'Arrear'}
              </Text>
              {' • '}
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

type TransactionsInContributionRoundProps = CompositeScreenProps<
  NativeStackScreenProps<AppRootStackParamList, 'Transactions in countribution round'>,
  CompositeScreenProps<
    NativeStackScreenProps<
      FinancialsStackParamList,
      'Transactions in countribution round'
    >,
    NativeStackScreenProps<HomeStackParamList, 'Transactions in countribution round'>
  >
>;

export const TransactionsInContributionRound: React.FunctionComponent<
  TransactionsInContributionRoundProps
> = ({ route, navigation }) => {
  const { id, day, billName } = route.params;

  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const [selectedTransaction, setSelectedTransaction] = React.useState<
    BillTransaction | undefined
  >(undefined);

  const {
    data: transactionsResponse,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: areTransactionsLoading,
    refetch: refetchTransactions,
    isStale: areTransactionsOnDayStale,
  } = useBillTransactionsOnDay(id, day ?? '');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (areTransactionsOnDayStale) refetchTransactions();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areTransactionsOnDayStale]);

  const transactions = React.useMemo(
    () => transactionsResponse?.pages.flatMap(page => page.results),
    [transactionsResponse?.pages],
  );
  const loadMoreTransactions = () => hasNextPage && fetchNextPage();

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
        isBack
      />

      <Screen
        customScreenName="Contributions on day"
        headerProps={{ paddingBottom: '1' }}
      >
        <Box backgroundColor="transparent" height={12}>
          {areTransactionsLoading && <LogoLoader />}
        </Box>

        {!areTransactionsLoading && (
          <DynamicText
            color="textLight"
            lineHeight={20}
            marginBottom="3"
            marginTop="2"
            maxWidth="90%"
            paddingHorizontal="6"
            variant="sm"
          >
            Here are all the contributions made towards{' '}
            <Text color="textDefault" fontFamily="Halver-Semibold" variant="sm">
              {billName}
            </Text>{' '}
            on {!!day && new Date(day).toDateString()}.
          </DynamicText>
        )}

        {noTransactionsFound && (
          <Text color="textLight" padding="6">
            We found no transactions
          </Text>
        )}

        <GestureHandlerRootView style={flexStyles[1]}>
          <FlashList
            // eslint-disable-next-line react-native/no-inline-styles
            contentContainerStyle={{ paddingBottom: isFetchingNextPage ? 0 : 12 }}
            data={transactions}
            estimatedItemSize={70}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={isFetchingNextPage ? <LogoLoader /> : undefined}
            renderItem={renderItem}
            onEndReached={loadMoreTransactions}
            onEndReachedThreshold={1.5}
          />
        </GestureHandlerRootView>
      </Screen>
    </>
  );
};
