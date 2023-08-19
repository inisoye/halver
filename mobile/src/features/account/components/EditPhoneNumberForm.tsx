import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { z } from 'zod';

import {
  Box,
  FullScreenLoader,
  KeyboardStickyButton,
  PaddedScreenHeader,
  Screen,
  Text,
  TextField,
  TextFieldError,
  TextFieldLabel,
} from '@/components';
import { useUpdateSingleUserDetail } from '@/features/account';
import { showToast } from '@/lib/root-toast';
import { handleAxiosErrorAlertAndHaptics, isMobilePhone } from '@/utils';

interface EditPhoneNumberFormProps {
  isOnboarding?: boolean;
  onComplete: () => void;
}

const PhoneFormSchema = z.object({
  phone: z.string().refine(phone => isMobilePhone(phone, 'en-NG'), {
    message: 'Please enter a valid Nigerian phone number.',
  }),
});

type PhoneFormValues = z.infer<typeof PhoneFormSchema>;

export const EditPhoneNumberForm: React.FunctionComponent<EditPhoneNumberFormProps> = ({
  isOnboarding,
  onComplete,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormValues>({
    defaultValues: { phone: undefined },
    resolver: zodResolver(PhoneFormSchema),
  });
  const { mutate: updateSingleUserDetail, isLoading: isUserDetailsUpdateLoading } =
    useUpdateSingleUserDetail();

  const onSubmit = (data: PhoneFormValues) => {
    updateSingleUserDetail(data, {
      onSuccess: () => {
        showToast('Phone number added successfully.');
        onComplete();
      },

      onError: error => {
        handleAxiosErrorAlertAndHaptics(
          'Error Adding Phone Number',
          error as AxiosError,
        );
      },
    });
  };

  return (
    <>
      <FullScreenLoader
        isVisible={isUserDetailsUpdateLoading}
        message="Saving your phone number..."
      />

      <Screen isHeaderShown={!isOnboarding} hasNoIOSBottomInset>
        <ScrollView keyboardDismissMode="interactive">
          {isOnboarding && (
            <PaddedScreenHeader
              heading="What's your phone number?"
              subHeading="Use a number your friends have. It'll help them find you easily on Halver."
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
              Use a number your friends have. It'll help them find you easily on Halver.
            </Text>
          )}

          <Box marginTop="10" paddingBottom="20" paddingHorizontal="6" paddingTop="2">
            <TextFieldLabel label="Your phone number" />

            <TextField
              control={control}
              keyboardType="phone-pad"
              name="phone"
              prefixText="+234"
              rules={{
                required: true,
              }}
            />

            {errors.phone && (
              <TextFieldError
                errorMessage={errors.phone?.message}
                fieldName="your phone number"
              />
            )}
          </Box>
        </ScrollView>

        <KeyboardStickyButton
          backgroundColor="buttonApricot"
          disabled={isUserDetailsUpdateLoading}
          onPress={handleSubmit(onSubmit)}
        >
          <Text color="buttonTextApricot" fontFamily="Halver-Semibold">
            {isUserDetailsUpdateLoading ? 'Loading...' : 'Continue'}
          </Text>
        </KeyboardStickyButton>
      </Screen>
    </>
  );
};