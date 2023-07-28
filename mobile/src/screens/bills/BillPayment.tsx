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
import { DefaultCardSelectorModal, useUpdateBillAction } from '@/features/bills';
import { CardIcon } from '@/features/financials';
import { useBooleanStateControl, useFullScreenLoader } from '@/hooks';
import { GoToArrow } from '@/icons';
import type { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import {
  convertKebabAndSnakeToTitleCase,
  convertNumberToNaira,
  handleAxiosErrorAlertAndHaptics,
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

  const { mutate: updateBillAction, isLoading: isBillUpdateLoading } =
    useUpdateBillAction();

  const handleGoToBill = () => {
    navigation.navigate('Bill', { id: billId || '', name: billName || '' });
  };

  const handleGoToBillWithUpdate = () => {
    navigation.navigate('Bill', {
      id: billId || '',
      name: billName || '',
      shouldUpdate: true,
    });
  };

  const handleBillPayment = () => {
    updateBillAction(
      {
        id: String(actionId),
        billActionResponseDto: {
          hasParticipantAgreed: true,
        },
      },
      {
        onSuccess: () => {
          openSuccessModal();
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics('Error Creating Bill', error as AxiosError);
        },
      },
    );
  };

  const handleOptOut = () => {
    updateBillAction(
      {
        id: String(actionId),
        billActionResponseDto: {
          hasParticipantAgreed: false,
        },
      },
      {
        onSuccess: () => {
          openOptOutConfirmationModal();
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics('Error Creating Bill', error as AxiosError);
        },
      },
    );
  };

  useFullScreenLoader({
    isLoading: isBillUpdateLoading,
  });

  const { data: userDetails } = useUserDetails();
  const { defaultCard } = userDetails || {};
  const { last4, cardType } = defaultCard || {};

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
              onPress={handleGoToBill}
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
              <Text variant="sm">{creditorName}</Text>
            </Box>

            <Box flexDirection="row" gap="4" justifyContent="space-between">
              <Text color="textLight" variant="sm">
                Your contribution
              </Text>
              <Text variant="sm">
                {contribution ? convertNumberToNaira(Number(contribution)) : undefined}
              </Text>
            </Box>

            <Box flexDirection="row" gap="4" justifyContent="space-between">
              <Text color="textLight" variant="sm">
                Fee
              </Text>
              <Text variant="sm">
                {fee ? convertNumberToNaira(Number(fee)) : undefined}
              </Text>
            </Box>

            <Box flexDirection="row" gap="4" justifyContent="space-between">
              <Text color="textLight" variant="sm">
                Deduction pattern
              </Text>
              <Text variant="sm">
                {deductionPattern === 'None'
                  ? 'One time'
                  : convertKebabAndSnakeToTitleCase(deductionPattern)}
              </Text>
            </Box>

            <Box flexDirection="row" gap="4" justifyContent="space-between">
              <Text color="textLight" variant="sm">
                Deadline
              </Text>
              <Text variant="sm">
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

          <DefaultCardSelectorModal />
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
            maxWidth="60%"
          >
            {isBillRecurring
              ? 'We will notify you after every successful charge.'
              : 'We will notify you once your contribution has been finalized.'}
          </DynamicText>

          <Button backgroundColor="green8" onPress={handleGoToBillWithUpdate}>
            <Box
              flexDirection="row"
              gap="4"
              justifyContent="space-between"
              width="100%"
            >
              <Text color="green12" fontFamily="Halver-Semibold">
                Go back to bill
              </Text>

              <GoToArrow />
            </Box>
          </Button>
        </Box>
      </SuccessModal>

      <Modal
        closeModal={closeOptOutConfirmationModal}
        headingText="You have successfully opted out of this bill"
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
          <DynamicText color="textLight" marginBottom="3" maxWidth="85%" variant="sm">
            The bill's creditor and creator will be notified.
          </DynamicText>

          <Button
            backgroundColor="modalElementBackground"
            onPress={handleGoToBillWithUpdate}
          >
            <Box
              flexDirection="row"
              gap="4"
              justifyContent="space-between"
              width="100%"
            >
              <Text color="buttonTextNeutral" fontFamily="Halver-Semibold">
                Go back to bill
              </Text>

              <GoToArrow />
            </Box>
          </Button>
        </Box>
      </Modal>
    </Screen>
  );
};
