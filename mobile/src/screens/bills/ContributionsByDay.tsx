import type {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  Box,
  DynamicText,
  LogoLoader,
  Screen,
  Text,
  TouchableOpacity,
} from '@/components';
import {
  BillContributionMeter,
  useBillContributionsByDay,
  type BillDailyContribution,
} from '@/features/bills';
import { RightCaret } from '@/icons';
import type { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import { flexStyles } from '@/theme';
import { convertNumberToNaira } from '@/utils';

interface ContributionDayItemProps {
  id: string;
  billName: string;
  item: BillDailyContribution | undefined;
  index: number;
  totalAmountDue: number;
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<
      BillsStackParamList,
      'Contributions by day',
      undefined
    >,
    NativeStackNavigationProp<
      AppRootStackParamList,
      'Contributions by day',
      undefined
    >
  >;
}

const ContributionDayItem: React.FunctionComponent<
  ContributionDayItemProps
> = ({ id, billName, item, index, totalAmountDue, navigation }) => {
  const handleGoToTransactions = () => {
    navigation.navigate('Transactions in countribution round', {
      id,
      day: item?.day,
      billName,
    });
  };

  return (
    <TouchableOpacity
      borderTopColor="borderDefault"
      borderTopWidth={index === 0 ? 0 : 0.5}
      marginHorizontal="6"
      paddingBottom="7"
      paddingTop={index === 0 ? '5' : '7'}
      onPress={handleGoToTransactions}
    >
      <Box
        alignItems="center"
        flexDirection="row"
        gap="4"
        justifyContent="space-between"
        marginBottom="3"
      >
        <Text fontFamily="Halver-Semibold" variant="lg">
          {!!item?.day && new Date(item?.day).toDateString()}
        </Text>

        {<RightCaret width={8} />}
      </Box>

      <BillContributionMeter
        totalAmountDue={totalAmountDue}
        totalAmountPaid={Number(item?.totalContribution)}
      />
    </TouchableOpacity>
  );
};

type ContributionsByDayProps = CompositeScreenProps<
  NativeStackScreenProps<BillsStackParamList, 'Contributions by day'>,
  NativeStackScreenProps<AppRootStackParamList, 'Contributions by day'>
>;

export const ContributionsByDay: React.FunctionComponent<
  ContributionsByDayProps
> = ({ route, navigation }) => {
  const { id, totalAmountDue, name, totalAmountPaid } = route.params;

  const {
    data: billContributionsByDayResponse,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: areBillContributionsByDayLoading,
  } = useBillContributionsByDay(id);

  const billContributionsByDay = React.useMemo(
    () => billContributionsByDayResponse?.pages.flatMap(page => page.results),
    [billContributionsByDayResponse?.pages],
  );

  const loadMoreContributions = () => hasNextPage && fetchNextPage();

  const renderItem: ListRenderItem<BillDailyContribution | undefined> = ({
    item,
    index,
  }) => {
    return (
      <ContributionDayItem
        billName={name}
        id={id}
        index={index}
        item={item}
        navigation={navigation}
        totalAmountDue={totalAmountDue}
      />
    );
  };

  return (
    <Screen
      customScreenName="Contribution rounds"
      headerProps={{ paddingBottom: '1' }}
    >
      <Box backgroundColor="transparent" height={12}>
        {areBillContributionsByDayLoading && <LogoLoader />}
      </Box>

      <DynamicText
        color="textLight"
        lineHeight={20}
        marginBottom="3"
        marginTop="2"
        paddingHorizontal="6"
        variant="sm"
      >
        All the rounds so far on{' '}
        <Text color="textDefault" fontFamily="Halver-Semibold" variant="sm">
          {name}
        </Text>
        .{' '}
        {`${convertNumberToNaira(
          totalAmountPaid,
        )} in total has been contributed since the bill was created.`}
      </DynamicText>

      <GestureHandlerRootView style={[flexStyles[1]]}>
        <FlashList
          // eslint-disable-next-line react-native/no-inline-styles
          contentContainerStyle={{ paddingBottom: isFetchingNextPage ? 0 : 12 }}
          data={billContributionsByDay}
          estimatedItemSize={70}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={isFetchingNextPage ? <LogoLoader /> : undefined}
          renderItem={renderItem}
          onEndReached={loadMoreContributions}
          onEndReachedThreshold={1.5}
        />
      </GestureHandlerRootView>
    </Screen>
  );
};
