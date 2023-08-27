import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AxiosError } from 'axios';
import * as React from 'react';
import { useMMKVObject } from 'react-native-mmkv';

import {
  Box,
  Button,
  Card,
  DynamicText,
  KeyboardStickyButton,
  Screen,
  ScrollView,
  SuccessModal,
  Text,
} from '@/components';
import {
  BillCreatePayload,
  BillCreationMMKVPayload,
  useCreateBill,
} from '@/features/new-bill';
import { useBooleanStateControl, useFullScreenLoader } from '@/hooks';
import { GoToArrow } from '@/icons';
import { allMMKVKeys } from '@/lib/mmkv';
import type { AppRootStackParamList } from '@/navigation';
import {
  convertKebabAndSnakeToTitleCase,
  convertNumberToNaira,
  handleAxiosErrorAlertAndHaptics,
} from '@/utils';

type BillSummaryProps = NativeStackScreenProps<AppRootStackParamList, 'Bill Summary'>;

export const BillSummary: React.FunctionComponent<BillSummaryProps> = ({
  navigation,
}) => {
  const [createdBill, setCreatedBill] = React.useState<
    { id: string; name: string } | undefined
  >(undefined);

  const [newBillPayload] = useMMKVObject<BillCreationMMKVPayload>(
    allMMKVKeys.newBillPayload,
  );

  const {
    state: isSuccessModalOpen,
    setTrue: openSuccessModal,
    setFalse: closeSuccessModal,
  } = useBooleanStateControl();

  const { mutate: createBill, isLoading: isCreateBillLoading } = useCreateBill();

  useFullScreenLoader({
    isLoading: isCreateBillLoading,
    message: 'Creating your bill...',
  });

  const {
    name: billName,
    totalAmountDue,
    registeredParticipants,
    unregisteredParticipants,
    creditorId,
    interval,
    deadline,
    firstChargeDate,
    notes,
  } = newBillPayload || {};

  const updatedParticipants = React.useMemo(
    () =>
      registeredParticipants?.map(obj => {
        let sum = 0;
        for (const key in obj) {
          if (key.startsWith('registeredContribution')) {
            sum += parseFloat(obj[key]);
          }
        }
        return {
          ...obj,
          contribution: sum,
        };
      }),
    [registeredParticipants],
  );
  const updatedUnregisteredParticipants = React.useMemo(
    () =>
      unregisteredParticipants?.map(obj => {
        let sum = 0;
        for (const key in obj) {
          if (key.startsWith('unregisteredContribution')) {
            sum += Number(obj[key]);
          }
        }
        return {
          name: obj.name,
          phone: obj.phone,
          contribution: sum,
        };
      }),
    [unregisteredParticipants],
  );

  const participantsContributionIndex: { [uuid: string]: number } = {};

  let creditorContribution = 0;

  updatedParticipants?.forEach(item => {
    if (item.uuid === creditorId) {
      creditorContribution = item.contribution;
      return;
    }

    if (item.uuid && item.uuid !== creditorId) {
      participantsContributionIndex[item.uuid] = item.contribution;
    }
  });

  const totalAmountDueExcludingCreditor = Number(totalAmountDue) - creditorContribution;

  const finalBillPayload: BillCreatePayload = {
    creditorId,
    unregisteredParticipants: updatedUnregisteredParticipants,
    name: billName,
    deadline: String(deadline),
    interval,
    notes,
    totalAmountDue: String(totalAmountDueExcludingCreditor),
    participantsContributionIndex,
  };

  if (interval !== 'none') {
    finalBillPayload.firstChargeDate = String(firstChargeDate);
  }

  const handleCreateBillSubmit = () => {
    createBill(finalBillPayload, {
      onSuccess: ({ uuid, name }) => {
        setCreatedBill({ id: uuid, name });
        setTimeout(() => {
          openSuccessModal();
        }, 250);
      },

      onError: error => {
        handleAxiosErrorAlertAndHaptics('Error Creating Bill', error as AxiosError);
      },
    });
  };

  const handleGoToBill = () => {
    navigation.navigate('TabsRoot', {
      screen: 'BillsStackNavigator',
      params: {
        screen: 'Bill',
        initial: false,
        params: {
          id: createdBill?.id || '',
          name: createdBill?.name || '',
        },
      },
    });
  };

  return (
    <Screen hasNoIOSBottomInset>
      <Box flex={1} paddingHorizontal="6" paddingVertical="2">
        <Card gap="10" paddingHorizontal="6" paddingVertical="8">
          <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="xl">
            {billName}
          </Text>

          <Box gap="4">
            <Box flexDirection="row" gap="4" justifyContent="space-between">
              <Text color="textLight" variant="sm">
                Deduction pattern
              </Text>
              <Text variant="sm">
                {interval === 'none'
                  ? 'One time'
                  : convertKebabAndSnakeToTitleCase(interval)}
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

            {!!firstChargeDate && (
              <Box flexDirection="row" gap="4" justifyContent="space-between">
                <Text color="textLight" variant="sm">
                  First charge date
                </Text>
                <Text variant="sm">
                  {firstChargeDate
                    ? new Date(firstChargeDate)?.toDateString()
                    : undefined}
                </Text>
              </Box>
            )}
          </Box>

          <Box gap="4" maxHeight={280}>
            <Text color="textLighter" variant="xs">
              Participants
            </Text>

            <ScrollView>
              <Box gap="4">
                {updatedParticipants?.map(({ uuid, phone, name, contribution }) => {
                  const isCreditor = uuid === creditorId;

                  return (
                    <Box
                      alignItems="center"
                      flexDirection="row"
                      gap="4"
                      justifyContent="space-between"
                      key={uuid || phone}
                    >
                      <Box
                        alignItems="center"
                        flexDirection="row"
                        flexShrink={1}
                        maxWidth="65%"
                        minWidth="50%"
                      >
                        <DynamicText
                          color={isCreditor ? 'green11' : 'textLight'}
                          maxWidth={isCreditor ? '56%' : undefined}
                          numberOfLines={1}
                          variant="sm"
                        >
                          {name}
                        </DynamicText>

                        {isCreditor && (
                          <DynamicText color="green11" variant="sm">
                            {' '}
                            - Creditor
                          </DynamicText>
                        )}
                      </Box>

                      <DynamicText
                        color={isCreditor ? 'green11' : undefined}
                        flexShrink={1}
                        textAlign="right"
                        textDecorationLine={isCreditor ? 'line-through' : undefined}
                        variant="sm"
                      >
                        {convertNumberToNaira(Number(contribution))}
                      </DynamicText>
                    </Box>
                  );
                })}
                {updatedUnregisteredParticipants?.map(
                  ({ phone, name, contribution }) => {
                    return (
                      <Box
                        alignItems="center"
                        flexDirection="row"
                        gap="4"
                        justifyContent="space-between"
                        key={phone}
                      >
                        <Box
                          alignItems="center"
                          flexDirection="row"
                          flexShrink={1}
                          maxWidth="65%"
                          minWidth="50%"
                        >
                          <DynamicText color="textLight" numberOfLines={1} variant="sm">
                            {name}
                          </DynamicText>
                        </Box>

                        <DynamicText flexShrink={1} textAlign="right" variant="sm">
                          {convertNumberToNaira(Number(contribution))}
                        </DynamicText>
                      </Box>
                    );
                  },
                )}
              </Box>
            </ScrollView>

            <Box
              borderTopColor="gray6"
              borderTopWidth={1}
              flexDirection="row"
              gap="4"
              justifyContent="space-between"
              paddingTop="4"
            >
              <Text color="textLight" variant="sm">
                Total amount due
              </Text>
              <DynamicText flexShrink={1} textAlign="right" variant="sm">
                {convertNumberToNaira(Number(totalAmountDueExcludingCreditor))}
              </DynamicText>
            </Box>
          </Box>
        </Card>
      </Box>

      <KeyboardStickyButton
        backgroundColor="buttonCasal"
        disabled={isCreateBillLoading}
        onPress={handleCreateBillSubmit}
      >
        <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
          {isCreateBillLoading ? 'Loading...' : 'Submit and share bill'}
        </Text>
      </KeyboardStickyButton>

      <SuccessModal
        closeModal={closeSuccessModal}
        hasCloseButton={false}
        headingText="Your bill was successfully created"
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
          <Text color="green12" fontFamily="Halver-Semibold" marginBottom="3">
            We have attempted to notify all the bill’s participants
          </Text>
          <Text color="green11" marginBottom="6" variant="sm">
            You can always send additional notifications later.
          </Text>

          <Button backgroundColor="green8" onPress={handleGoToBill}>
            <Box
              flexDirection="row"
              gap="4"
              justifyContent="space-between"
              width="100%"
            >
              <Text color="green12" fontFamily="Halver-Semibold">
                Go to bill
              </Text>

              <GoToArrow />
            </Box>
          </Button>
        </Box>
      </SuccessModal>
    </Screen>
  );
};
