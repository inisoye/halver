import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, TextInput, View } from 'react-native';
import { z } from 'zod';

import { Button, PaddedScreenHeader, Screen, Text } from '@/components';
import { useUpdateUserDetails } from '@/features/account';
import { formatAxiosErrorMessage, isMobilePhone } from '@/utils';

const MoreDetailsSchema = z.object({
  phone: z.string().refine(phone => isMobilePhone(phone, 'en-NG'), {
    message: 'Please enter a valid Nigerian phone number.',
  }),
});

type MoreDetails = z.infer<typeof MoreDetailsSchema>;

export const MoreUserDetails: React.FunctionComponent = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MoreDetails>({
    defaultValues: { phone: undefined },
    resolver: zodResolver(MoreDetailsSchema),
  });
  const { mutate: updateUserDetails, isLoading: isUserDetailsUpdateLoading } =
    useUpdateUserDetails();

  const onSubmit = (data: MoreDetails) => {
    updateUserDetails(data, {
      onError: error => {
        const errorMessage = formatAxiosErrorMessage(error as AxiosError);

        if (errorMessage) {
          Alert.alert('Error Adding Phone Number', errorMessage, [
            {
              text: 'OK',
              style: 'default',
            },
          ]);
        }
      },
    });
  };

  return (
    <Screen isHeaderShown={false} hasLogoFooter>
      <PaddedScreenHeader
        heading="What's your phone number?"
        subHeading="This will make friends find you easily on Halver."
        hasExtraPadding
      />

      <View className="mt-10 p-2 px-6">
        <Text className="mb-1.5" variant="sm" isLight>
          Your phone number
        </Text>

        <View
          className="flex-row"
          style={{ gap: 4 }} // eslint-disable-line react-native/no-inline-styles
        >
          <View className="justify-center rounded bg-grey-light-200 px-3 dark:bg-grey-dark-200">
            <Text isLight>+234</Text>
          </View>

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="flex-1 rounded bg-grey-light-200 p-3 font-sans-medium text-[16px] text-grey-light-1000 dark:bg-grey-dark-200 dark:text-grey-dark-1000"
                keyboardType="phone-pad"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
            rules={{
              required: 'Please enter your phone number.',
            }}
          />
        </View>

        {errors.phone && (
          <View className="mt-1.5 overflow-hidden rounded-sm bg-red-dark-700 px-2 py-1 dark:bg-red-dark-500">
            <Text className="font-sans-bold leading-[14px] text-white" variant="xs">
              {!errors.phone.message || errors.phone.message === 'Required'
                ? 'Please enter your phone number.'
                : errors.phone.message}
            </Text>
          </View>
        )}

        <Button
          className="mt-12"
          color="casal"
          disabled={isUserDetailsUpdateLoading}
          isTextContentOnly
          onPress={handleSubmit(onSubmit)}
        >
          {isUserDetailsUpdateLoading ? 'Loading...' : 'Continue'}
        </Button>
      </View>
    </Screen>
  );
};
