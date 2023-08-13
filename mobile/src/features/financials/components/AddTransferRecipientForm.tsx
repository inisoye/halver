import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { z } from 'zod';

import {
  Box,
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
import { useBooleanStateControl } from '@/hooks';
import { showToast } from '@/lib/root-toast';
import { PaystackBank } from '@/lib/zod';
import {
  convertKebabAndSnakeToTitleCase,
  handleAxiosErrorAlertAndHaptics,
} from '@/utils';

import {
  TransferRecipientCreatePayload,
  useBanks,
  useCreateTransferRecipient,
  useValidateAccountDetails,
} from '../api';
import { BankSelector } from './BankSelector';

interface AddTransferRecipientFormProps {
  onComplete: () => void;
  isOnboarding?: boolean;
}

const BankDetailsFormSchema = z.object({
  accountNumber: z
    .string()
    .regex(/^\d+$/, { message: 'Your account number must be a number.' })
    .min(10, { message: 'Your account number should be 10 characters.' })
    .max(10, { message: 'Your account number should be 10 characters.' }),
  bank: PaystackBank,
});

export type BankDetailsFormValues = z.infer<typeof BankDetailsFormSchema>;

export const AddTransferRecipientForm: React.FunctionComponent<AddTransferRecipientFormProps> =
  React.memo(({ onComplete, isOnboarding }) => {
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
    const {
      mutate: validateAccountDetails,
      isLoading: isValidateAccountDetailsLoading,
    } = useValidateAccountDetails();
    const {
      mutate: createTransferRecipient,
      isLoading: isCreateTransferRecipientLoading,
    } = useCreateTransferRecipient();

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
            handleAxiosErrorAlertAndHaptics(
              'Error Validating Account Details',
              error as AxiosError,
            );
          },
        },
      );
    };

    const onCreateTransferRecipientSubmit = () => {
      createTransferRecipient(transferRecipientPayload, {
        onSuccess: () => {
          closeConfirmationModal();
          showToast('Bank account added successfully.');
          onComplete();
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics(
            'Error Adding New Recipient',
            error as AxiosError,
          );
        },
      });
    };

    return (
      <>
        <FullScreenLoader
          isVisible={isValidateAccountDetailsLoading}
          message="Validating your account details..."
        />

        <Screen isHeaderShown={!isOnboarding} hasNoIOSBottomInset>
          <ScrollView keyboardShouldPersistTaps="handled">
            {isOnboarding && (
              <PaddedScreenHeader
                heading="Your bank account details"
                subHeading="This will be where you'll get paid on Halver. We call them transfer recipients. You can always change it or add more later."
                hasExtraPadding
              />
            )}

            {!isOnboarding && (
              <Text
                color="textLight"
                marginTop="1"
                paddingHorizontal="6"
                paddingVertical="2"
                variant="sm"
              >
                Transfer recipients are bank accounts you'll use to receive payments on
                Halver.
              </Text>
            )}

            <Box
              flex={1}
              gap="7"
              marginTop={isOnboarding ? '10' : '4'}
              paddingBottom="20"
              paddingHorizontal="6"
              paddingTop="2"
            >
              <View>
                <BankSelector
                  areBanksLoading={areBanksLoading}
                  banks={banks}
                  selectedBank={selectedBank}
                  setValue={setValue}
                />
                {errors.bank && (
                  <TextFieldError
                    errorMessage={errors.bank?.message}
                    fieldName="your bank"
                  />
                )}
              </View>

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
            </Box>
          </ScrollView>

          <KeyboardStickyButton
            backgroundColor="buttonCasal"
            disabled={areBanksLoading || isValidateAccountDetailsLoading}
            onPress={handleSubmit(onAccountValidationSubmit)}
          >
            <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
              {areBanksLoading || isValidateAccountDetailsLoading
                ? 'Loading...'
                : 'Continue'}
            </Text>
          </KeyboardStickyButton>

          <Modal
            closeModal={closeConfirmationModal}
            hasCloseButton={false}
            headingText={
              transferRecipientPayload.name
                ? convertKebabAndSnakeToTitleCase(transferRecipientPayload.name)
                : undefined
            }
            isLoaderOpen={
              isValidateAccountDetailsLoading || isCreateTransferRecipientLoading
            }
            isModalOpen={isConfirmationModalOpen}
            hasLargeHeading
          >
            <Box
              backgroundColor="modalBackground"
              paddingBottom="10"
              paddingHorizontal="6"
              paddingTop="6"
            >
              <Text fontFamily="Halver-Semibold" marginBottom="3">
                Is this you?
              </Text>
              <Text color="textLight" marginBottom="6" variant="sm">
                To continue, confirm that the above name is the name associated with the
                account details you have entered.
              </Text>

              <Box flexDirection="row" gap="3">
                <Button
                  backgroundColor="buttonNeutralDarker"
                  flex={1}
                  onPress={closeConfirmationModal}
                >
                  <Text fontFamily="Halver-Semibold">No</Text>
                </Button>
                <Button
                  backgroundColor="buttonCasal"
                  disabled={isCreateTransferRecipientLoading}
                  flex={1}
                  onPress={onCreateTransferRecipientSubmit}
                >
                  <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                    {isCreateTransferRecipientLoading ? 'Loading...' : 'Yes'}
                  </Text>
                </Button>
              </Box>
            </Box>
          </Modal>
        </Screen>
      </>
    );
  });
