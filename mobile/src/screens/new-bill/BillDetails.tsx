import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { z } from 'zod';

import {
  KeyboardStickyButton,
  Screen,
  TextField,
  TextFieldError,
  TextFieldLabel,
} from '@/components';
import { BillDeadlineSelector } from '@/features/new-bill';
import { AppRootStackParamList } from '@/navigation';
import { gapStyles } from '@/theme';

type BillAmountProps = NativeStackScreenProps<AppRootStackParamList, 'Bill Details'>;

const BillDetailsFormSchema = z.object({
  totalAmountDue: z.coerce
    .number({
      required_error: 'A bill amount is required.',
      invalid_type_error: 'The bill amount is required and must be a number.',
    })
    .min(500, { message: 'The total bill amount must be at least 500 Naira.' }),
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
});

export type BillDetailsFormValues = z.infer<typeof BillDetailsFormSchema>;

export const BillDetails: React.FunctionComponent<BillAmountProps> = (
  {
    // navigation,
  },
) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BillDetailsFormValues>({
    defaultValues: {
      totalAmountDue: undefined,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    resolver: zodResolver(BillDetailsFormSchema),
  });

  const onBillDetailsSubmit = (submittedData: BillDetailsFormValues) => {
    // eslint-disable-next-line no-console
    console.log(submittedData);
  };

  return (
    <Screen hasNoIOSBottomInset>
      <ScrollView
        className="p-2 px-6"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        <View style={gapStyles[28]}>
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
        </View>
      </ScrollView>

      <KeyboardStickyButton
        color="casal"
        isTextContentOnly
        onPress={handleSubmit(onBillDetailsSubmit)}
      >
        Continue
      </KeyboardStickyButton>
    </Screen>
  );
};
