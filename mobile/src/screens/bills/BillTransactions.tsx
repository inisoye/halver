import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  Box,
  DynamicText,
  FullWidthTextField,
  LogoLoader,
  RectButton,
  Screen,
  Text,
} from '@/components';
import { useInfiniteBillTransactions, type BillTransaction } from '@/features/bills';
import { SelectedTransactionModal } from '@/features/financials';
import { useBooleanStateControl, useDebounce } from '@/hooks';
import { RightCaret, Search } from '@/icons';
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
  index,
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
      marginTop={index === 0 ? '4' : '1'}
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
                On {!!created && new Date(created).toDateString()}
              </Text>
            </Text>
          </Box>
        </Box>

        <RightCaret />
      </Box>
    </RectButton>
  );
};

type BillTransactionsProps = CompositeScreenProps<
  NativeStackScreenProps<AppRootStackParamList, 'Bill transactions'>,
  CompositeScreenProps<
    NativeStackScreenProps<FinancialsStackParamList, 'Bill transactions'>,
    NativeStackScreenProps<HomeStackParamList, 'Bill transactions'>
  >
>;

export const BillTransactions: React.FunctionComponent<BillTransactionsProps> = ({
  route,
  navigation,
}) => {
  const { id, name } = route.params;

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
  const debouncedFilterValue = useDebounce(transactionsFilterValue, 500);

  const {
    data: transactionsResponse,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: areTransactionsLoading,
    refetch: refetchTransactions,
    isStale: areTransactionsStale,
  } = useInfiniteBillTransactions(id, debouncedFilterValue);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (areTransactionsStale) refetchTransactions();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areTransactionsStale]);

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

      <Screen headerProps={{ paddingBottom: '1' }}>
        <DynamicText
          color="textLight"
          lineHeight={20}
          marginTop="4"
          opacity={areTransactionsLoading ? 0 : undefined}
          paddingHorizontal="6"
          variant="sm"
        >
          All the contributions made towards{' '}
          <Text color="textDefault" fontFamily="Halver-Semibold" variant="sm">
            {name}
          </Text>
        </DynamicText>

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
          placeholder="Search by participant"
          prefixComponent={<Search />}
        />

        {noTransactionsFound && (
          <Text color="textLight" padding="6">
            We found no transactions
            {!!transactionsFilterValue && ` matching "${transactionsFilterValue}"`}
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
          />
        </GestureHandlerRootView>
      </Screen>
    </>
  );
};
