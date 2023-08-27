import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { useMMKVObject } from 'react-native-mmkv';
import { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { z } from 'zod';

import {
  AnimatedBox,
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
import { showToast } from '@/lib/root-toast';
import { IntervalEnum } from '@/lib/zod';
import type { AppRootStackParamList } from '@/navigation';
import { convertNumberToNaira, isIOS } from '@/utils';

const styles = StyleSheet.create({
  scrollContainer: {},
});

type BillDetailsProps = NativeStackScreenProps<AppRootStackParamList, 'Bill Details'>;

const validateDecimalPlaces = (value: number) => {
  const pattern = /^\d+(\.\d{1,2})?$/; // 2dp
  return pattern.test(String(value));
};

const BillDetailsFormSchema = z
  .object({
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
      .refine(val => validateDecimalPlaces(val), {
        message: 'The bill amount must have a maximum of 2 decimal places.',
      })
      .transform(amount => amount.toString()),
    name: z
      .string({ required_error: 'A bill name is required.' })
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
        message: 'The first charge date must be in the future.',
      })
      .optional(),
    notes: z
      .string()
      .max(100, {
        message: 'Please ensure your description less than 500 characters',
      })
      .optional(),
  })
  .refine(
    // Refine method on schema to ensure recurring bills have first charge date entered.
    schema => {
      return schema.interval !== 'none' && schema.firstChargeDate === undefined
        ? false
        : true;
    },
    {
      message: "The bill's first charge date is required.",
      path: ['firstChargeDate'],
    },
  );

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

const oneDayFromNow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

export const BillDetails: React.FunctionComponent<BillDetailsProps> = ({
  navigation,
}) => {
  const [newBillPayload, setNewBillPayload] = useMMKVObject<BillCreationMMKVPayload>(
    allMMKVKeys.newBillPayload,
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<BillDetailsFormValues>({
    defaultValues: {
      totalAmountDue: newBillPayload?.totalAmountDue || undefined,
      name: newBillPayload?.name || undefined,
      notes: newBillPayload?.notes || undefined,
      deadline: newBillPayload?.deadline
        ? new Date(newBillPayload?.deadline)
        : twoDaysFromNow,
      interval: newBillPayload?.interval || intervalOptions[0].value,
      firstChargeDate: newBillPayload?.firstChargeDate
        ? new Date(newBillPayload?.firstChargeDate)
        : oneDayFromNow,
    },
    resolver: zodResolver(BillDetailsFormSchema),
  });

  const intervalValue = useWatch({ control, name: 'interval' });
  const isRecurringBill = intervalValue !== 'none';

  // Added for because error on first charge date field might be invisible.
  React.useEffect(() => {
    if (errors.firstChargeDate) {
      showToast(
        errors.firstChargeDate?.message || 'Invalid first charge date',
        'error',
      );
    }
  }, [errors.firstChargeDate]);

  // Added to catch errors in schema's refine method.
  React.useEffect(() => {
    if (errors['']) {
      showToast(errors['']?.message, 'error');
    }
  }, [errors]);

  // Reset the first charge date when the bill is one-time.
  React.useEffect(() => {
    if (!isRecurringBill) {
      setValue('firstChargeDate', undefined);
    }
  }, [isRecurringBill, setValue]);

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
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Box gap="7" paddingBottom="20" paddingHorizontal="6" paddingTop="4">
          <Box>
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
          </Box>

          <Box>
            <TextFieldLabel label="Give the bill a name" />
            <TextField
              control={control}
              name="name"
              placeholder="e.g. Our Netflix Subscription"
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
          </Box>

          <Box>
            <TextFieldLabel label="Add a quick note" isOptional />
            <TextField
              control={control}
              height={80}
              multiline={true}
              name="notes"
              numberOfLines={4}
              paddingVertical={isIOS() ? '3' : '2.5'}
              placeholder="e.g. Hi guys! This is just for all of us to conveniently make our contributions."
              textAlignVertical="top"
            />
            {errors.notes && (
              <TextFieldError
                errorMessage={errors.notes?.message}
                fieldName="a name for the bill"
              />
            )}
          </Box>

          <Box>
            <BillDeadlineSelector control={control} />

            {errors.deadline && (
              <TextFieldError
                errorMessage={errors.deadline?.message}
                fieldName="your bill's deadline"
              />
            )}
          </Box>

          <Box>
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
          </Box>

          {isRecurringBill && (
            <AnimatedBox entering={FadeInUp} exiting={FadeOutDown}>
              <BillFirstChargeDateSelector control={control} />

              {errors.firstChargeDate && (
                <TextFieldError
                  errorMessage={errors.firstChargeDate?.message}
                  fieldName="your bill's first charge date"
                />
              )}
            </AnimatedBox>
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
