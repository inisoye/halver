import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  AfterInteractions,
  AnimatedBox,
  AnimatedText,
  Box,
  Button,
  DynamicText,
  LogoLoader,
  Screen,
  ScrollView,
  Text,
  TouchableOpacity,
} from '@/components';
import { useUserDetails } from '@/features/account';
import {
  BillContributionMeter,
  BillCreatorCreditorFlag,
  BillParticipantsList,
  BillRecentContributionsList,
  CancelBillModal,
  CancelSubscriptionModal,
  ShareBillModal,
  statusColorIndex,
  useBill,
  useBillContributionsByDay,
  useInfiniteBillTransactions,
} from '@/features/bills';
import { useIsFirstRender } from '@/hooks';
import { BackWithBackground, Gear, Rewind } from '@/icons';
import { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import { formatNumberWithCommas, isIOS } from '@/utils';

type BillProps = CompositeScreenProps<
  NativeStackScreenProps<AppRootStackParamList, 'Bill'>,
  NativeStackScreenProps<BillsStackParamList, 'Bill'>
>;

export const Bill = ({ navigation, route }: BillProps) => {
  const scrollY = useSharedValue(0);
  const threshold = 70; // Adjust this threshold value

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  /**
   * TS errors are ignored in the following lines due to type mismatch issues from Reanimated.
   * https://github.com/software-mansion/react-native-reanimated/issues/4548
   * https://github.com/software-mansion/react-native-reanimated/issues/4645
   * Review later if fixes are made.
   */

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const headerTitleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = withTiming(scrollY.value >= threshold ? 1 : 0);
    const translateY = withSpring(scrollY.value >= threshold ? 0 : 15);

    return {
      opacity,
      transform: [{ translateY: translateY }],
    };
  });

  const { id, name, shouldUpdate, isOnRoot } = route.params;

  const { data: userDetails } = useUserDetails();
  const { uuid: currentUserUUID } = userDetails || {};

  const {
    data: bill,
    isLoading: isBillLoading,
    isRefetching: isBillRefetching,
    refetch: refetchBill,
    isStale: isBillStale,
  } = useBill(id);

  const isFirstRender = useIsFirstRender();

  const isBillForceUpdating = isBillRefetching && shouldUpdate && isFirstRender;
  const shouldForceUpdate = shouldUpdate && isFirstRender;

  const {
    actions,
    creator,
    creditor,
    created,
    deadline,
    firstChargeDate,
    interval,
    isCreditor,
    isCreator,
    isDiscreet,
    notes,
    status,
    totalAmountDue: totalAmountDueString,
    totalAmountPaid: totalAmountPaidString,
  } = bill || {};

  const isBillRecurring = interval !== 'None';

  const totalAmountDue = Number(totalAmountDueString);
  const totalAmountPaid = Number(totalAmountPaidString);

  const billStatusColor = status?.short
    ? statusColorIndex[status?.short]
    : undefined;

  const {
    refetch: refetchBillTransactions,
    isStale: areBillTransactionsStale,
  } = useInfiniteBillTransactions(id);
  const {
    data: billContributionsByDayResponse,
    refetch: refetchBillContributionsByDay,
    isStale: areBillContributionsByDayStale,
  } = useBillContributionsByDay(id, isBillRecurring);

  const billContributionsByDay = React.useMemo(
    () => billContributionsByDayResponse?.pages.flatMap(page => page.results),
    [billContributionsByDayResponse?.pages],
  );

  const {
    day: dayOfLastContributionRound,
    totalContribution: totalContributionOfLastRound,
  } = billContributionsByDay?.[0] || {};

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (isBillStale) refetchBill();
      if (areBillTransactionsStale) refetchBillTransactions();
      if (isBillRecurring && areBillContributionsByDayStale) {
        refetchBillContributionsByDay();
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shouldForceUpdate,
    isBillRecurring,
    areBillContributionsByDayStale,
    areBillTransactionsStale,
    isBillStale,
  ]);

  const areAnyParticipantsUnregistered = React.useMemo(
    () => actions?.some(action => action.status === 'unregistered'),
    [actions],
  );

  const currentUserAction = React.useMemo(
    () =>
      actions?.find(action => action?.participant?.uuid === currentUserUUID),
    [actions, currentUserUUID],
  );

  const currentUserActionStatus = currentUserAction?.status;
  const isCurrentUserStatusFinal =
    currentUserActionStatus === 'completed' ||
    currentUserActionStatus === 'ongoing' ||
    currentUserActionStatus === 'opted_out' ||
    currentUserActionStatus === 'pending_transfer' ||
    currentUserActionStatus === 'payment_initialized' ||
    currentUserActionStatus === 'cancelled';

  const handleGoBack = () => {
    navigation.goBack();
  };

  const billPaymentScreenPayload = {
    actionId: currentUserAction?.uuid,
    status: currentUserActionStatus,
    billId: id,
    contribution: currentUserAction?.contribution,
    creditorName: creditor?.fullName,
    deadline,
    deductionPattern: interval,
    fee: currentUserAction?.totalFee,
    firstChargeDate,
    name,
    isOnRoot,
  };

  const handlePaymentNavigation = () => {
    navigation.navigate('Bill Payment', billPaymentScreenPayload);
  };

  const handleContributionsNavigation = () => {
    navigation.navigate('Contributions by day', {
      id,
      totalAmountDue,
      name,
      totalAmountPaid,
    });
  };

  const buttonBottomMargin = isOnRoot ? (isIOS() ? '10' : '7') : '3';

  const canMakeContribution =
    !isBillLoading && !isCreditor && !isCurrentUserStatusFinal;

  const hasActiveSubscription =
    !isBillLoading && currentUserActionStatus === 'ongoing' && !isCreditor;

  const canCancelBill =
    isCreator &&
    status?.short !== 'cancelled' &&
    status?.short !== 'completed' &&
    status?.short !== 'opted_out';

  return (
    <Screen
      backgroundColor="billScreenBackground"
      customScreenName={name}
      isHeaderShown={false}
      opacity={isBillForceUpdating ? 0.6 : 1}
      hasNoIOSBottomInset
    >
      <Box
        alignItems="center"
        flexDirection="row"
        gap="4"
        justifyContent="space-between"
        paddingBottom="1"
        paddingHorizontal="6"
        paddingTop={isIOS() ? '5' : '8'}
      >
        <Box alignItems="center" flexDirection="row" flexShrink={1} gap="4">
          <TouchableOpacity
            hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
            onPress={handleGoBack}
          >
            <BackWithBackground />
          </TouchableOpacity>

          <Box
            alignItems="center"
            flexDirection="row"
            flexGrow={1}
            flexShrink={1}
            gap="2"
            justifyContent="flex-start"
          >
            <AnimatedText
              flexShrink={1}
              fontFamily="Halver-Semibold"
              lineHeight={32}
              numberOfLines={1}
              style={headerTitleAnimatedStyle}
              variant="2xl"
            >
              {name}
            </AnimatedText>

            <AnimatedBox
              backgroundColor={billStatusColor}
              borderRadius="sm"
              height={6}
              style={headerTitleAnimatedStyle}
              width={6}
            />
          </Box>
        </Box>

        {isCreator && false && (
          <TouchableOpacity>
            <Gear />
          </TouchableOpacity>
        )}

        {areAnyParticipantsUnregistered && (
          <ShareBillModal actions={actions} billName={name} />
        )}
      </Box>

      <Box backgroundColor="transparent" height={16}>
        <AfterInteractions>{isBillLoading && <LogoLoader />}</AfterInteractions>
      </Box>

      <Box backgroundColor="background" flex={1}>
        <ScrollView scrollEventThrottle={200} onScroll={handleScroll}>
          <Box
            backgroundColor="billScreenBackground"
            borderBottomEndRadius="2xl"
            borderBottomStartRadius="2xl"
            padding="6"
          >
            <Box
              flexDirection="row"
              gap="8"
              justifyContent="space-between"
              marginBottom="12"
            >
              <DynamicText
                flexShrink={1}
                fontFamily="Halver-Semibold"
                numberOfLines={2}
                variant="4xl"
              >
                {name}
              </DynamicText>

              <DynamicText
                color={billStatusColor}
                fontFamily="Halver-Semibold"
                lineHeight={13.5}
                opacity={status?.long ? 1 : 0}
                textAlign="right"
                variant="xs"
                width="28%"
              >
                {status?.long || 'Loading status'}
              </DynamicText>
            </Box>

            {!isBillLoading && (
              <AnimatedBox entering={FadeInDown.springify()}>
                {isBillRecurring && (
                  <>
                    {totalAmountPaid === 0 || !totalContributionOfLastRound ? (
                      <DynamicText
                        color="textLight"
                        fontFamily="Halver-Semibold"
                      >
                        No contributions yet.
                      </DynamicText>
                    ) : (
                      <>
                        <Box
                          alignItems="center"
                          flexDirection="row"
                          gap="4"
                          justifyContent="space-between"
                          marginBottom="4"
                        >
                          <DynamicText
                            color="textLight"
                            fontFamily="Halver-Semibold"
                            maxWidth="85%"
                            variant="sm"
                          >
                            Last contribution round on{' '}
                            {!!dayOfLastContributionRound &&
                              new Date(
                                dayOfLastContributionRound,
                              ).toDateString()}
                            .
                          </DynamicText>

                          <TouchableOpacity
                            hitSlop={{
                              top: 40,
                              bottom: 40,
                              left: 40,
                              right: 40,
                            }}
                            onPress={handleContributionsNavigation}
                          >
                            <Rewind />
                          </TouchableOpacity>
                        </Box>

                        <BillContributionMeter
                          totalAmountDue={totalAmountDue}
                          totalAmountPaid={Number(totalContributionOfLastRound)}
                        />
                      </>
                    )}

                    {false && (
                      <DynamicText
                        color="textLight"
                        fontFamily="Halver-Semibold"
                        marginTop="4"
                        variant="sm"
                      >
                        {totalAmountPaid === 0 ? (
                          'No contributions yet'
                        ) : (
                          <>
                            <Text color="textLight" fontFamily="Halver-Naira">
                              ₦
                            </Text>
                            {`${formatNumberWithCommas(
                              totalAmountPaid,
                            )} contributed since bill creation.`}
                          </>
                        )}
                      </DynamicText>
                    )}
                  </>
                )}

                {!isBillRecurring && (
                  <BillContributionMeter
                    totalAmountDue={totalAmountDue}
                    totalAmountPaid={totalAmountPaid}
                  />
                )}
              </AnimatedBox>
            )}
          </Box>

          <Box
            gap="10"
            paddingBottom={canMakeContribution ? '2' : '8'}
            paddingHorizontal="6"
            paddingTop="8"
          >
            {!!notes && (
              <Box gap="3">
                <Text color="textLight" variant="sm">
                  {notes}
                </Text>

                <Text
                  color="textLight"
                  fontFamily="Halver-Semibold"
                  variant="sm"
                >
                  — {creator?.firstName} (bill creator)
                </Text>
              </Box>
            )}

            {!!actions && (
              <BillParticipantsList
                actions={actions}
                billName={name}
                isDiscreet={isDiscreet}
              />
            )}

            {!isBillLoading && (
              <BillRecentContributionsList
                id={id}
                isDiscreet={isDiscreet}
                name={name}
                navigation={navigation}
              />
            )}

            {!isBillLoading && (
              <Box gap="6" marginBottom="10" marginTop="60">
                <Box
                  columnGap="2"
                  flexDirection="row"
                  flexWrap="wrap"
                  justifyContent="center"
                >
                  {!!creator && (
                    <BillCreatorCreditorFlag creatorOrCreditor={creator} />
                  )}

                  {!!creditor && (
                    <BillCreatorCreditorFlag
                      creatorOrCreditor={creditor}
                      hasDelay
                      isCreditor
                    />
                  )}
                </Box>

                {hasActiveSubscription && (
                  <CancelSubscriptionModal
                    actionId={currentUserAction?.uuid}
                    billId={id}
                    billName={name}
                  />
                )}

                {canCancelBill && <CancelBillModal billId={id} />}

                {!!created && (
                  <DynamicText
                    color="textLight"
                    textAlign="center"
                    variant="xs"
                  >
                    Bill created on {new Date(created).toDateString()}
                  </DynamicText>
                )}
              </Box>
            )}
          </Box>
        </ScrollView>
      </Box>

      {canMakeContribution && (
        <Box
          backgroundColor="background"
          borderTopColor="borderDefault"
          borderTopWidth={0.3}
          paddingBottom={buttonBottomMargin}
          paddingHorizontal="6"
          paddingTop="3"
        >
          <Button
            backgroundColor="buttonCasal"
            disabled={isBillLoading || isBillForceUpdating}
            entering={FadeInDown.springify().delay(350)}
            onPress={handlePaymentNavigation}
          >
            <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
              Make your contribution
            </Text>
          </Button>
        </Box>
      )}
    </Screen>
  );
};
