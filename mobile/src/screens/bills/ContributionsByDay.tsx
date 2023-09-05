import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Box, DynamicText, LogoLoader, Screen, Text } from '@/components';
import {
  BillContributionMeter,
  useBillContributionsByDay,
  type BillDailyContribution,
} from '@/features/bills';
import type { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import { flexStyles } from '@/theme';
import { convertNumberToNaira } from '@/utils';

type ContributionsByDayProps = CompositeScreenProps<
  NativeStackScreenProps<BillsStackParamList, 'Contributions by day'>,
  NativeStackScreenProps<AppRootStackParamList, 'Contributions by day'>
>;

export const ContributionsByDay: React.FunctionComponent<ContributionsByDayProps> = ({
  route,
}) => {
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
      <Box
        borderTopColor="borderDarker"
        borderTopWidth={index === 0 ? 0 : 0.5}
        marginHorizontal="6"
        paddingBottom="7"
        paddingTop={index === 0 ? '3' : '7'}
      >
        <Text fontFamily="Halver-Semibold" marginBottom="2.5" variant="lg">
          {!!item?.day && new Date(item?.day).toDateString()}
        </Text>

        <BillContributionMeter
          totalAmountDue={totalAmountDue}
          totalAmountPaid={Number(item?.totalContribution)}
        />
      </Box>
    );
  };

  return (
    <Screen customScreenName="Contribution rounds" headerProps={{ paddingBottom: '1' }}>
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
        All the rounds so far on {name}.{' '}
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
        />
      </GestureHandlerRootView>
    </Screen>
  );
};
