import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ResponsiveValue } from '@shopify/restyle';
import * as React from 'react';
import type {
  DimensionValue,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
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
  BillCreatorCreditorFlag,
  BillParticipantsList,
  BillRecentContributionsList,
  CancelBillModal,
  CancelSubscriptionModal,
  statusColorIndex,
  useBill,
  useBillTransactions,
} from '@/features/bills';
import { BackWithBackground, Gear } from '@/icons';
import { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import { convertNumberToNaira, formatNumberWithCommas, isIOS } from '@/utils';

type BillProps = CompositeScreenProps<
  NativeStackScreenProps<BillsStackParamList, 'Bill'>,
  NativeStackScreenProps<AppRootStackParamList>
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
    const translateY = withSpring(scrollY.value >= threshold ? 0 : 30);

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
  } = useBill(id);

  const isBillForceUpdating = isBillRefetching && shouldUpdate;

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

  const percentagePaid =
    totalAmountDue > 0
      ? Math.min(100, (totalAmountPaid / totalAmountDue) * 100).toFixed()
      : 0;

  const billStatusColor = status?.short ? statusColorIndex[status?.short] : undefined;

  const { refetch: refetchBillTransactions } = useBillTransactions(id);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (shouldUpdate) {
        refetchBill();
        refetchBillTransactions();
      }
    });

    return unsubscribe;
  }, [navigation, refetchBill, refetchBillTransactions, shouldUpdate]);

  const currentUserAction = actions?.find(
    action => action?.participant?.uuid === currentUserUUID,
  );
  const currentUserActionStatus = currentUserAction?.status;
  const isCurrentUserStatusFinal =
    currentUserActionStatus === 'completed' ||
    currentUserActionStatus === 'ongoing' ||
    currentUserActionStatus === 'opted_out' ||
    currentUserActionStatus === 'pending_transfer' ||
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
        <Box alignItems="center" flexDirection="row" maxWidth="60%">
          <TouchableOpacity
            hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
            marginRight="4"
            onPress={handleGoBack}
          >
            <BackWithBackground />
          </TouchableOpacity>

          <AnimatedText
            fontFamily="Halver-Semibold"
            lineHeight={32}
            marginRight="2"
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

        {isCreator && false && (
          <TouchableOpacity>
            <Gear />
          </TouchableOpacity>
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
              gap="2"
              justifyContent="space-between"
              marginBottom="12"
            >
              <DynamicText
                fontFamily="Halver-Semibold"
                maxWidth="70%"
                numberOfLines={2}
                variant="4xl"
              >
                {name}
              </DynamicText>

              <DynamicText
                color={billStatusColor}
                fontFamily="Halver-Semibold"
                lineHeight={13.5}
                maxWidth="30%"
                textAlign="right"
                variant="xs"
              >
                {status?.long}
              </DynamicText>
            </Box>

            {!isBillLoading && (
              <AnimatedBox entering={FadeInDown.springify()}>
                {isBillRecurring && (
                  <>
                    <Text color="textLight" fontFamily="Halver-Semibold">
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
                    </Text>
                  </>
                )}

                {!isBillRecurring && (
                  <>
                    <Box
                      flexDirection="row"
                      gap="4"
                      justifyContent="space-between"
                      marginBottom="2"
                    >
                      <Text color="textLight" fontFamily="Halver-Semibold" variant="xs">
                        {totalAmountPaid === 0
                          ? 'No contributions yet'
                          : `${percentagePaid}% contributed`}
                      </Text>
                      <DynamicText
                        fontFamily="Halver-Semibold"
                        maxWidth="64%"
                        textAlign="right"
                        variant="xs"
                      >
                        {convertNumberToNaira(totalAmountPaid)} out of{' '}
                        {convertNumberToNaira(totalAmountDue)}
                      </DynamicText>
                    </Box>

                    <Box
                      backgroundColor="elementBackground"
                      borderRadius="sm2"
                      height={12}
                    >
                      <AnimatedBox
                        backgroundColor="billMeterBackground"
                        borderRadius="sm2"
                        height={12}
                        width={
                          `${percentagePaid}%` as ResponsiveValue<
                            DimensionValue | undefined,
                            {
                              phone: number;
                              tablet: number;
                            }
                          >
                        }
                      />
                    </Box>
                  </>
                )}
              </AnimatedBox>
            )}
          </Box>

          <Box
            columnGap="2"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
            paddingHorizontal="6"
          >
            {!!creator && <BillCreatorCreditorFlag creatorOrCreditor={creator} />}

            {!!creditor && (
              <BillCreatorCreditorFlag
                creatorOrCreditor={creditor}
                hasDelay
                isCreditor
              />
            )}
          </Box>

          <Box
            gap="8"
            paddingBottom={canMakeContribution ? '2' : '8'}
            paddingHorizontal="6"
            paddingTop="10"
          >
            {!!notes && (
              <Box
                backgroundColor="elementBackground"
                borderRadius="lg"
                elevation={0.5}
                gap="3"
                paddingVertical="3"
                px="4"
                shadowColor="black"
                shadowOffset={{
                  width: 0.1,
                  height: 0.3,
                }}
                shadowOpacity={0.2}
                shadowRadius={0.3}
              >
                <Text color="textLight" fontSize={13} variant="sm">
                  {notes}
                </Text>

                <Text color="textLight" fontSize={13} variant="sm">
                  — {creator?.firstName} (bill creator)
                </Text>
              </Box>
            )}

            {!!actions && (
              <BillParticipantsList actions={actions} isDiscreet={isDiscreet} />
            )}

            {!isBillLoading && (
              <BillRecentContributionsList id={id} isDiscreet={isDiscreet} />
            )}

            {!isBillLoading && (
              <Box gap="6" marginBottom="10" marginTop="60">
                {hasActiveSubscription && (
                  <CancelSubscriptionModal
                    actionId={currentUserAction?.uuid}
                    billId={id}
                    billName={name}
                  />
                )}

                {canCancelBill && <CancelBillModal billId={id} />}

                <DynamicText color="textLight" textAlign="center" variant="xs">
                  Bill created on {!!created && new Date(created).toDateString()}
                </DynamicText>
              </Box>
            )}
          </Box>
        </ScrollView>
      </Box>

      {canMakeContribution && (
        <Box
          backgroundColor="background"
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
