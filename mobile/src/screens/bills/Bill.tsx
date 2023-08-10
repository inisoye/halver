import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ResponsiveValue } from '@shopify/restyle';
import * as React from 'react';
import type { DimensionValue } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';

import {
  AfterInteractions,
  AnimatedBox,
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
  statusColorIndex,
  useBill,
  useBillTransactions,
} from '@/features/bills';
import { BackWithBackground, Gear } from '@/icons';
import { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import { convertNumberToNaira, formatNumberWithCommas } from '@/utils';

type BillProps = CompositeScreenProps<
  NativeStackScreenProps<BillsStackParamList, 'Bill'>,
  NativeStackScreenProps<AppRootStackParamList>
>;

export const Bill = ({ navigation, route }: BillProps) => {
  const { id, name, shouldUpdate } = route.params;

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
    deadline,
    firstChargeDate,
    interval,
    isCreditor,
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
  };

  const handlePaymentNavigation = () => {
    navigation.navigate('Bill Payment', billPaymentScreenPayload);
  };

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
        paddingTop="5"
      >
        <TouchableOpacity
          hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
          onPress={handleGoBack}
        >
          <BackWithBackground />
        </TouchableOpacity>

        <Gear />
      </Box>

      <Box backgroundColor="transparent" height={16}>
        <AfterInteractions>{isBillLoading && <LogoLoader />}</AfterInteractions>
      </Box>

      <Box backgroundColor="background" flex={1}>
        <ScrollView>
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
              marginBottom="8"
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
                          <Text color="textLight">₦</Text>
                          {`${formatNumberWithCommas(
                            totalAmountPaid,
                          )} contributed since bill creation`}
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

          <Box gap="8" paddingBottom="2" paddingHorizontal="6" paddingTop="7">
            {!!notes && (
              <Box gap="3">
                <Text color="textLight" variant="sm">
                  {notes}
                </Text>

                <Text color="textLight" fontFamily="Halver-Semibold" variant="xs">
                  — {creator?.firstName} (bill creator)
                </Text>
              </Box>
            )}

            {!!actions && (
              <BillParticipantsList actions={actions} isDiscreet={isDiscreet} />
            )}

            <BillRecentContributionsList id={id} isDiscreet={isDiscreet} />
          </Box>
        </ScrollView>
      </Box>

      {!isBillLoading && !isCreditor && !isCurrentUserStatusFinal && (
        <Box backgroundColor="background" paddingHorizontal="6" paddingVertical="3">
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