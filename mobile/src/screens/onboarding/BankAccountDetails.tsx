import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { z } from 'zod';

import {
  Button,
  FullScreenLoader,
  KeyboardStickyButton,
  Modal,
  PaddedScreenHeader,
  Screen,
  Text,
  TextField,
  TextFieldError,
  TextFieldLabel,
} from '@/components';
import {
  BankSelector,
  TransferRecipientCreatePayload,
  useBanks,
  useCreateTransferRecipient,
  useValidateAccountDetails,
} from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { PaystackBank } from '@/lib/zod';
import type { OnboardingStackParamList } from '@/navigation';
import { gapStyles } from '@/theme';
import { convertKebabAndSnakeToTitleCase, handleErrorAlertAndHaptics } from '@/utils';

type BankAcountDetailsProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'BankAccountDetails'
>;

const BankDetailsFormSchema = z.object({
  accountNumber: z
    .string()
    .regex(/^\d+$/, { message: 'Your account number must be a number.' })
    .min(10, { message: 'Your account number should be 10 characters.' })
    .max(10, { message: 'Your account number should be 10 characters.' }),
  bank: PaystackBank,
});

export type BankDetailsFormValues = z.infer<typeof BankDetailsFormSchema>;

export const BankAccountDetails: React.FunctionComponent<BankAcountDetailsProps> = ({
  navigation,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BankDetailsFormValues>({
    defaultValues: { accountNumber: undefined, bank: undefined },
    resolver: zodResolver(BankDetailsFormSchema),
  });

  const {
    state: isConfirmationModalOpen,
    setTrue: openConfirmationModal,
    setFalse: closeConfirmationModal,
  } = useBooleanStateControl();

  const { data: banks, isLoading: areBanksLoading } = useBanks();
  const { mutate: validateAccountDetails, isLoading: isValidateAccountDetailsLoading } =
    useValidateAccountDetails();
  const { mutate: createTransferRecipient, isLoading: isCreateTransferRecipientLoading } =
    useCreateTransferRecipient();

  const selectedBank = useWatch({ control, name: 'bank' });

  const [transferRecipientPayload, setTransferRecipientPayload] =
    React.useState<TransferRecipientCreatePayload>({
      name: '',
      recipientType: 'nuban',
      accountNumber: '',
      bankCode: '',
    });

  const onAccountValidationSubmit = (submittedData: BankDetailsFormValues) => {
    validateAccountDetails(
      {
        accountNumber: submittedData.accountNumber,
        bankCode: submittedData.bank.code,
      },
      {
        onSuccess: data => {
          const { accountName, accountNumber } = data.data;
          setTransferRecipientPayload({
            ...transferRecipientPayload,
            name: accountName,
            accountNumber,
            bankCode: submittedData.bank.code,
          });
          openConfirmationModal();
        },

        onError: error => {
          handleErrorAlertAndHaptics('Error Validating Account Details', error as AxiosError);
        },
      },
    );
  };

  const onCreateTransferRecipientSubmit = () => {
    createTransferRecipient(transferRecipientPayload, {
      onSuccess: () => {
        closeConfirmationModal();
        navigation.navigate('CardDetails');
      },

      onError: error => {
        handleErrorAlertAndHaptics('Error Adding New Recipient', error as AxiosError);
      },
    });
  };

  return (
    <>
      <FullScreenLoader
        isVisible={isValidateAccountDetailsLoading}
        message="Validating your account details..."
      />

      <Screen isHeaderShown={false} hasNoIOSBottomInset hasVerticalStack>
        <ScrollView keyboardShouldPersistTaps="handled">
          <PaddedScreenHeader
            heading="Your bank account details"
            subHeading="This will be where you'll get paid on Halver. We call them recipients. You can always change it or add more later."
            hasExtraPadding
          />

          <View className="mt-10 flex-1 p-2 px-6 pb-20" style={gapStyles[28]}>
            <View>
              <TextFieldLabel label="Your account number" />
              <TextField
                control={control}
                keyboardType="number-pad"
                name="accountNumber"
                rules={{
                  required: true,
                }}
              />
              {errors.accountNumber && (
                <TextFieldError
                  errorMessage={errors.accountNumber?.message}
                  fieldName="your account number"
                />
              )}
            </View>

            <View>
              <BankSelector
                areBanksLoading={areBanksLoading}
                banks={banks}
                selectedBank={selectedBank}
                setValue={setValue}
              />
              {errors.bank && (
                <TextFieldError errorMessage={errors.bank?.message} fieldName="your bank" />
              )}
            </View>
          </View>
        </ScrollView>

        <KeyboardStickyButton
          disabled={areBanksLoading || isValidateAccountDetailsLoading}
          isTextContentOnly
          onPress={handleSubmit(onAccountValidationSubmit)}
        >
          {areBanksLoading || isValidateAccountDetailsLoading ? 'Loading...' : 'Continue'}
        </KeyboardStickyButton>

        <Modal
          closeModal={closeConfirmationModal}
          hasCloseButton={false}
          headingText={
            transferRecipientPayload.name
              ? convertKebabAndSnakeToTitleCase(transferRecipientPayload.name)
              : undefined
          }
          isLoaderOpen={isValidateAccountDetailsLoading || isCreateTransferRecipientLoading}
          isModalOpen={isConfirmationModalOpen}
          hasLargeHeading
        >
          <View className="bg-grey-light-50 p-6 pb-10 dark:bg-grey-dark-50">
            <Text className="mb-3">Is this you?</Text>
            <Text className="mb-6" color="light" variant="sm">
              To continue, confirm that the above name is the name associated with the account
              details you have entered.
            </Text>

            <View className="flex-row" style={gapStyles[12]}>
              <Button
                className="flex-1"
                color="neutral"
                isTextContentOnly
                onPress={closeConfirmationModal}
              >
                No
              </Button>
              <Button
                className="flex-1"
                color="casal"
                disabled={isCreateTransferRecipientLoading}
                isTextContentOnly
                onPress={onCreateTransferRecipientSubmit}
              >
                {isCreateTransferRecipientLoading ? 'Loading...' : 'Yes'}
              </Button>
            </View>
          </View>
        </Modal>
      </Screen>
    </>
  );
};
