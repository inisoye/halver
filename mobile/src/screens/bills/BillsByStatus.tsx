import {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  Box,
  FullWidthTextField,
  LogoLoader,
  RectButton,
  Screen,
  Text,
  TouchableOpacity,
} from '@/components';
import {
  BillActionStatus,
  BillActionStatusItem,
  useUserActionsByStatus,
} from '@/features/bills';
import { useDebounce } from '@/hooks';
import { Plus, RightCaret, Search } from '@/icons';
import { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import { flexStyles } from '@/theme';
import { convertNumberToNaira, useIsDarkModeSelected } from '@/utils';

interface BillListRenderItemProps {
  item: BillActionStatusItem | undefined;
  index: number;
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<BillsStackParamList, 'Bills By Status', undefined>,
    NativeStackNavigationProp<AppRootStackParamList, 'Bills By Status', undefined>
  >;
}

const BillListRenderItem: React.FunctionComponent<BillListRenderItemProps> = ({
  item,
  index,
  navigation,
}) => {
  const isDarkMode = useIsDarkModeSelected();

  const handleGoToBill = () => {
    navigation.navigate('Bill', {
      id: item?.bill.uuid || '',
      name: item?.bill.name || '',
      isOnRoot: true,
    });
  };

  return (
    <RectButton
      activeOpacity={0.05}
      marginTop={index === 0 ? '4' : undefined}
      underlayColor={isDarkMode ? 'white' : 'black'}
      onPress={handleGoToBill}
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
          <Box width="90%">
            <Text fontFamily="Halver-Semibold" marginBottom="0.75" numberOfLines={1}>
              {item?.bill.name}
            </Text>

            <Text
              color="textLight"
              fontFamily="Halver-Semibold"
              numberOfLines={1}
              variant="xs"
            >
              {!!item?.created && new Date(item.created).toDateString()}
              {' • '}
              <Text color="textLight" fontFamily="Halver-Semibold" variant="xs">
                {!!item?.contribution &&
                  convertNumberToNaira(Number(item?.contribution))}
              </Text>
            </Text>
          </Box>
        </Box>

        <RightCaret />
      </Box>
    </RectButton>
  );
};

type BillsByStatusProps = CompositeScreenProps<
  NativeStackScreenProps<BillsStackParamList, 'Bills By Status'>,
  NativeStackScreenProps<AppRootStackParamList, 'Bills By Status'>
>;

export const BillsByStatus = ({ route, navigation }: BillsByStatusProps) => {
  const { status } = route.params;

  const { control: controlForBillFilter } = useForm<{
    billFilter: string;
  }>({
    defaultValues: {
      billFilter: '',
    },
  });

  const billFilterValue = useWatch({
    control: controlForBillFilter,
    name: 'billFilter',
  });
  const debouncedFilterValue = useDebounce(billFilterValue, 500);

  const {
    data: billsResponse,
    isLoading: areBillsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserActionsByStatus(
    debouncedFilterValue,
    status.toLowerCase() === 'recurring'
      ? 'ongoing'
      : (status.toLowerCase() as BillActionStatus),
  );

  const bills = React.useMemo(
    () => billsResponse?.pages.flatMap(page => page.results),
    [billsResponse?.pages],
  );
  const loadMoreBills = () => hasNextPage && fetchNextPage();

  const noBillsFound = !areBillsLoading && (!bills || bills?.length < 1);

  const renderItem: ListRenderItem<BillActionStatusItem | undefined> = ({
    item,
    index,
  }) => {
    return <BillListRenderItem index={index} item={item} navigation={navigation} />;
  };

  const handleGoToCreateBill = React.useCallback(() => {
    navigation.navigate('Bill Details');
  }, [navigation]);

  return (
    <Screen
      customScreenName={`${status} bills`}
      headerRightComponent={
        <TouchableOpacity
          hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
          onPress={handleGoToCreateBill}
        >
          <Plus />
        </TouchableOpacity>
      }
      hasNoIOSBottomInset
    >
      <Box backgroundColor="transparent" height={12}>
        {areBillsLoading && <LogoLoader />}
      </Box>

      <FullWidthTextField
        autoFocus={false}
        containerProps={{ marginTop: '0' }}
        control={controlForBillFilter}
        name="billFilter"
        paddingHorizontal="0"
        paddingRight="6"
        placeholder="Search by bill name"
        prefixComponent={<Search />}
      />

      {noBillsFound && (
        <Text color="textLight" padding="6">
          We found no bills
          {!!billFilterValue && ` matching "${billFilterValue}"`}
        </Text>
      )}

      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <GestureHandlerRootView style={[flexStyles[1], { marginBottom: 24 }]}>
        <FlashList
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{ paddingBottom: isFetchingNextPage ? 0 : 12 }}
          data={bills}
          estimatedItemSize={70}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={isFetchingNextPage ? <LogoLoader /> : undefined}
          renderItem={renderItem}
          onEndReached={loadMoreBills}
        />
      </GestureHandlerRootView>
    </Screen>
  );
};
