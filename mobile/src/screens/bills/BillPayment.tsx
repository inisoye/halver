import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AxiosError } from 'axios';
import * as React from 'react';
import { FadeInDown } from 'react-native-reanimated';

import {
  AnimatedBox,
  Box,
  Button,
  DynamicText,
  Modal,
  Screen,
  SuccessModal,
  Text,
} from '@/components';
import { useUserDetails } from '@/features/account';
import {
  AddCardReminderModal,
  DefaultCardSelectorModal,
  useUpdateBillAction,
} from '@/features/bills';
import { CardIcon } from '@/features/financials';
import { useBooleanStateControl, useFullScreenLoader } from '@/hooks';
import { GoBackArrow } from '@/icons';
import type { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import {
  convertKebabAndSnakeToTitleCase,
  convertNumberToNaira,
  handleAxiosErrorAlertAndHaptics,
  handleBiometricAuthentication,
  handleGenericErrorAlertAndHaptics,
  isIOS,
} from '@/utils';

type BillPaymentProps = CompositeScreenProps<
  NativeStackScreenProps<BillsStackParamList, 'Bill Payment'>,
  NativeStackScreenProps<AppRootStackParamList, 'Bill Payment'>
>;

export const BillPayment = ({ navigation, route }: BillPaymentProps) => {
  const {
    name: billName,
    billId,
    actionId,
    status,
    contribution,
    creditorName,
    deadline,
    deductionPattern,
    fee,
    isOnRoot,
  } = route.params;

  const isBillOverdue = status === 'overdue';
  const isBillRecurring = deductionPattern !== 'None';

  const {
    state: isSuccessModalOpen,
    setTrue: openSuccessModal,
    setFalse: closeSuccessModal,
  } = useBooleanStateControl();

  const {
    state: isOptOutConfirmationModalOpen,
    setTrue: openOptOutConfirmationModal,
    setFalse: closeOptOutConfirmationModal,
  } = useBooleanStateControl();

  const {
    state: isCardReminderModalOpen,
    setTrue: openCardReminderModal,
    setFalse: closeCardReminderModal,
  } = useBooleanStateControl();

  const { mutate: updateBillAction, isLoading: isBillUpdateLoading } =
    useUpdateBillAction();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoToBillWithUpdate = () => {
    navigation.navigate('Bill', {
      id: billId || '',
      name: billName || '',
      shouldUpdate: true,
      isOnRoot,
    });

    closeSuccessModal();
    closeOptOutConfirmationModal();
  };

  const { data: userDetails } = useUserDetails();
  const { defaultCard } = userDetails || {};
  const { last4, cardType } = defaultCard || {};

  const handleBillPayment = async () => {
    if (!defaultCard) {
      openCardReminderModal();
      return;
    }

    const isUserAuthenticated = await handleBiometricAuthentication();

    if (isUserAuthenticated) {
      updateBillAction(
        {
          id: String(actionId),
          billActionResponseDto: {
            hasParticipantAgreed: true,
          },
        },
        {
          onSuccess: () => {
            setTimeout(() => {
              openSuccessModal();
            }, 200);
          },

          onError: error => {
            handleAxiosErrorAlertAndHaptics(
              'Error in bill payment',
              error as AxiosError,
            );
          },
        },
      );
    } else {
      handleGenericErrorAlertAndHaptics(
        'Error in bill payment',
        'You must verify your identity to make a payment',
      );
    }
  };

  const handleOptOut = async () => {
    const isUserAuthenticated = await handleBiometricAuthentication();

    if (isUserAuthenticated) {
      updateBillAction(
        {
          id: String(actionId),
          billActionResponseDto: {
            hasParticipantAgreed: false,
          },
        },
        {
          onSuccess: () => {
            setTimeout(() => {
              openOptOutConfirmationModal();
            }, 200);
          },

          onError: error => {
            handleAxiosErrorAlertAndHaptics(
              'Error in opting out of bill',
              error as AxiosError,
            );
          },
        },
      );
    } else {
      handleGenericErrorAlertAndHaptics(
        'Error in opting out of bill',
        'You must verify your identity to opt out of a bill',
      );
    }
  };

  useFullScreenLoader({
    isLoading: isBillUpdateLoading,
    message: 'Processing your selection...',
  });

  return (
    <Screen>
      <Box flex={1} paddingHorizontal="6" paddingVertical="2">
        {isBillOverdue && (
          <Box
            backgroundColor="inputErrorBackground"
            borderTopEndRadius="lg"
            borderTopStartRadius="lg"
            paddingVertical="1.5"
          >
            <Text
              color="textWhite"
              fontFamily="Halver-Semibold"
              textAlign="center"
              variant="xs"
            >
              This bill is overdue
            </Text>
          </Box>
        )}
        <Box
          backgroundColor="elementBackground"
          borderRadius="lg"
          borderTopEndRadius={isBillOverdue ? 'none' : 'lg'}
          borderTopStartRadius={isBillOverdue ? 'none' : 'lg'}
          elevation={1}
          gap="10"
          paddingHorizontal="6"
          paddingVertical="8"
          shadowColor="black"
          shadowOffset={{
            width: 0,
            height: 1,
          }}
          shadowOpacity={0.18}
          shadowRadius={1.0}
        >
          <Box
            alignItems="flex-start"
            flexDirection="row"
            gap="4"
            justifyContent="space-between"
          >
            <DynamicText
              fontFamily="Halver-Semibold"
              maxWidth="60%"
              numberOfLines={2}
              variant="xl"
            >
              {billName}
            </DynamicText>

            <Button
              backgroundColor="inputNestedButtonBackground"
              variant="xs"
              onPress={handleGoBack}
            >
              <Text fontFamily="Halver-Semibold" variant="xs">
                Review bill
              </Text>
            </Button>
          </Box>

          <Box gap="6">
            <Box flexDirection="row" gap="4" justifyContent="space-between">
              <Text color="textLight" variant="sm">
                To
              </Text>
              <Text fontFamily="Halver-Semibold" variant="sm">
                {creditorName}
              </Text>
            </Box>

            <Box flexDirection="row" gap="4" justifyContent="space-between">
              <Text color="textLight" variant="sm">
                Your contribution
              </Text>
              <Text fontFamily="Halver-Semibold" variant="sm">
                {contribution
                  ? convertNumberToNaira(Number(contribution))
                  : undefined}
              </Text>
            </Box>

            <Box flexDirection="row" gap="4" justifyContent="space-between">
              <Text color="textLight" variant="sm">
                Fee
              </Text>
              <Text fontFamily="Halver-Semibold" variant="sm">
                {fee ? convertNumberToNaira(Number(fee)) : undefined}
              </Text>
            </Box>

            <Box flexDirection="row" gap="4" justifyContent="space-between">
              <Text color="textLight" variant="sm">
                Deduction pattern
              </Text>
              <Text fontFamily="Halver-Semibold" variant="sm">
                {deductionPattern === 'None'
                  ? 'One time'
                  : convertKebabAndSnakeToTitleCase(deductionPattern)}
              </Text>
            </Box>

            <Box flexDirection="row" gap="4" justifyContent="space-between">
              <Text color="textLight" variant="sm">
                Deadline
              </Text>
              <Text fontFamily="Halver-Semibold" variant="sm">
                {deadline ? new Date(deadline).toDateString() : undefined}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {!!defaultCard && (
        <AnimatedBox
          alignItems="center"
          backgroundColor="elementBackground"
          borderRadius="base"
          columnGap="3"
          entering={FadeInDown.springify().delay(500)}
          flexDirection="row"
          justifyContent="space-between"
          marginBottom="2"
          marginHorizontal="6"
          paddingHorizontal="6"
          paddingVertical="2.5"
        >
          <Box alignItems="center" columnGap="2" flexDirection="row">
            <CardIcon type={cardType} />

            <Text color="textLight" fontFamily="Halver-Semibold" variant="sm">
              •••• {last4}
            </Text>
          </Box>

          <DefaultCardSelectorModal navigation={navigation} />
        </AnimatedBox>
      )}

      <Box
        backgroundColor="background"
        flexDirection="row"
        gap="2"
        justifyContent="space-between"
        paddingBottom={isIOS() ? '10' : '7'}
        paddingHorizontal="6"
      >
        <Button
          backgroundColor="buttonNeutral"
          entering={FadeInDown.springify().delay(100)}
          flexGrow={1}
          onPress={handleOptOut}
        >
          <Text color="buttonTextNeutral" fontFamily="Halver-Semibold">
            Opt out
          </Text>
        </Button>

        <Button
          backgroundColor="buttonCasal"
          entering={FadeInDown.springify().delay(350)}
          flexGrow={1}
          onPress={handleBillPayment}
        >
          <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
            Pay now
          </Text>
        </Button>
      </Box>

      <AddCardReminderModal
        closeCardReminderModal={closeCardReminderModal}
        isCardReminderModalOpen={isCardReminderModalOpen}
        navigation={navigation}
      />

      {!isBillUpdateLoading && (
        <>
          <SuccessModal
            closeModal={closeSuccessModal}
            hasCloseButton={false}
            headingText={`Great! ${
              isBillRecurring
                ? 'Your subscription has now been created'
                : 'Your payment is now being finalized.'
            }`}
            isLoaderOpen={false}
            isModalOpen={isSuccessModalOpen}
            hasLargeHeading
          >
            <Box
              backgroundColor="successModalBackground"
              paddingBottom="8"
              paddingHorizontal="6"
              paddingTop="6"
            >
              <DynamicText
                color="green12"
                fontFamily="Halver-Semibold"
                marginBottom="6"
                width="75%"
              >
                {isBillRecurring
                  ? 'We will notify you after every successful charge.'
                  : 'We will notify you once your contribution has been finalized.'}
              </DynamicText>

              <Button
                backgroundColor="green6"
                onPress={handleGoToBillWithUpdate}
              >
                <Box
                  alignItems="center"
                  flexDirection="row"
                  gap="4"
                  width="100%"
                >
                  <GoBackArrow />

                  <Text color="green12" fontFamily="Halver-Semibold">
                    Go back to bill
                  </Text>
                </Box>
              </Button>
            </Box>
          </SuccessModal>

          <Modal
            closeModal={closeOptOutConfirmationModal}
            headingText="You have successfully opted out of this bill."
            isLoaderOpen={false}
            isModalOpen={isOptOutConfirmationModalOpen}
            hasLargeHeading
          >
            <Box
              backgroundColor="modalBackground"
              paddingBottom="8"
              paddingHorizontal="6"
              paddingTop="6"
            >
              <DynamicText
                color="textLight"
                marginBottom="6"
                maxWidth="85%"
                variant="sm"
              >
                The bill's creditor and creator will be notified.
              </DynamicText>

              <Button
                backgroundColor="buttonCasal"
                onPress={handleGoToBillWithUpdate}
              >
                <Box
                  alignItems="center"
                  flexDirection="row"
                  gap="4"
                  width="100%"
                >
                  <GoBackArrow isLight />

                  <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                    Go back to bill
                  </Text>
                </Box>
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </Screen>
  );
};
