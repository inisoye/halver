import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';
import { useMMKVObject } from 'react-native-mmkv';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { z } from 'zod';

import {
  Box,
  KeyboardStickyButton,
  RadioSelector,
  Screen,
  ScrollView,
  Text,
  TextField,
  TextFieldError,
  TextFieldLabel,
} from '@/components';
import {
  BillCreationMMKVPayload,
  BillDeadlineSelector,
  BillFirstChargeDateSelector,
  MINIMUM_BILL_AMOUNT,
} from '@/features/new-bill';
import { allMMKVKeys } from '@/lib/mmkv';
import { IntervalEnum } from '@/lib/zod';
import { AppRootStackParamList } from '@/navigation';
import { convertNumberToNaira } from '@/utils';

type BillAmountProps = NativeStackScreenProps<AppRootStackParamList, 'Bill Details'>;

const BillDetailsFormSchema = z.object({
  totalAmountDue: z.coerce
    .number({
      required_error: 'A bill amount is required.',
      invalid_type_error: 'The bill amount is required and must be a number.',
    })
    .min(MINIMUM_BILL_AMOUNT, {
      message: `The total bill amount must be at least ${convertNumberToNaira(
        MINIMUM_BILL_AMOUNT,
      )}.`,
    })
    .transform(amount => amount.toString()),
  name: z
    .string()
    .max(100, { message: 'Your bill name should be less than 100 characters.' }),
  deadline: z.coerce
    .date({
      required_error: "The bill's deadline is required.",
      invalid_type_error: 'The deadline must be a valid date.',
    })
    .refine(data => data > new Date(), {
      message: "Your bill's deadline must be in the future.",
    }),
  interval: IntervalEnum,
  firstChargeDate: z.coerce
    .date({
      required_error: "The bill's first charge date is required.",
      invalid_type_error: 'The first charge date must be a valid date.',
    })
    .refine(data => data > new Date(), {
      message: "Your bill's first charge date must be in the future.",
    })
    .optional(),
});

export type BillDetailsFormValues = z.infer<typeof BillDetailsFormSchema>;

export const intervalOptions = [
  { value: 'none', name: 'One time' },
  { value: 'daily', name: 'Daily' },
  { value: 'weekly', name: 'Weekly' },
  { value: 'monthly', name: 'Monthly' },
  { value: 'quarterly', name: 'Quarterly' },
  { value: 'biannually', name: 'Biannually' },
  { value: 'annually', name: 'Annually' },
] as const;

const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

export const BillDetails: React.FunctionComponent<BillAmountProps> = ({
  navigation,
}) => {
  const [newBillPayload, setNewBillPayload] = useMMKVObject<BillCreationMMKVPayload>(
    allMMKVKeys.newBillPayload,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BillDetailsFormValues>({
    defaultValues: {
      totalAmountDue: newBillPayload?.totalAmountDue || undefined,
      name: newBillPayload?.name || undefined,
      deadline: newBillPayload?.deadline
        ? new Date(newBillPayload?.deadline)
        : twoDaysFromNow,
      interval: newBillPayload?.interval || intervalOptions[0].value,
      firstChargeDate: newBillPayload?.firstChargeDate
        ? new Date(newBillPayload?.firstChargeDate)
        : twoDaysFromNow,
    },
    resolver: zodResolver(BillDetailsFormSchema),
  });

  const intervalValue = useWatch({ control, name: 'interval' });
  const isRecurringBill = intervalValue !== 'none';

  const onBillDetailsSubmit = (submittedData: BillDetailsFormValues) => {
    const { firstChargeDate: _firstChargeDate, ...dataWithoutFirstChargeDate } =
      submittedData;

    const participantsData = {
      unregisteredParticipants: newBillPayload?.unregisteredParticipants || [],
      registeredParticipants: newBillPayload?.registeredParticipants || [],
    };

    if (isRecurringBill) {
      setNewBillPayload({
        ...submittedData,
        ...participantsData,
      });
    } else {
      setNewBillPayload({
        ...dataWithoutFirstChargeDate,
        ...participantsData,
      });
    }

    navigation.navigate('Select Participants');
  };

  return (
    <Screen hasNoIOSBottomInset>
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        paddingHorizontal="6"
        paddingVertical="2"
      >
        <Box gap="7" paddingBottom="20">
          <View>
            <TextFieldLabel label="How much is the bill?" />

            <TextField
              control={control}
              keyboardType="number-pad"
              name="totalAmountDue"
              placeholder="min. ₦500"
              prefixText="₦"
              rules={{
                required: true,
              }}
            />
            {errors.totalAmountDue && (
              <TextFieldError
                errorMessage={errors.totalAmountDue?.message}
                fieldName="the total amount due"
              />
            )}
          </View>

          <View>
            <TextFieldLabel label="Give the bill a name" />
            <TextField
              control={control}
              name="name"
              placeholder="e.g Our Netflix Subscription"
              rules={{
                required: true,
              }}
            />
            {errors.name && (
              <TextFieldError
                errorMessage={errors.name?.message}
                fieldName="a name for the bill"
              />
            )}
          </View>

          <View>
            <BillDeadlineSelector control={control} />

            {errors.deadline && (
              <TextFieldError
                errorMessage={errors.deadline?.message}
                fieldName="your bill's deadline"
              />
            )}
          </View>

          <View>
            <TextFieldLabel label="Is this a one-time or periodic bill?" />

            <Controller
              control={control}
              name="interval"
              render={({ field: { onChange, value } }) => {
                return (
                  <RadioSelector
                    data={intervalOptions}
                    option={value}
                    setOption={onChange}
                  />
                );
              }}
            />

            {errors.interval && (
              <TextFieldError
                errorMessage={errors.interval?.message}
                fieldName="your bill's interval"
              />
            )}
          </View>

          {isRecurringBill && (
            <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
              <BillFirstChargeDateSelector control={control} />

              {errors.firstChargeDate && (
                <TextFieldError
                  errorMessage={errors.firstChargeDate?.message}
                  fieldName="your bill's first charge date"
                />
              )}
            </Animated.View>
          )}
        </Box>
      </ScrollView>

      <KeyboardStickyButton
        backgroundColor="buttonCasal"
        onPress={handleSubmit(onBillDetailsSubmit)}
      >
        <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
          Continue
        </Text>
      </KeyboardStickyButton>
    </Screen>
  );
};
