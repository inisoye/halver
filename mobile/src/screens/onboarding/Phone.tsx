import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AxiosError } from 'axios';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { z } from 'zod';

import {
  Button,
  KeyboardStickyView,
  PaddedScreenHeader,
  Screen,
  TextField,
  TextFieldError,
  TextFieldLabel,
} from '@/components';
import { useUpdateSingleUserDetail } from '@/features/account';
import { useKeyboardVisibility } from '@/hooks';
import { OnboardingStackParamList } from '@/navigation';
import { cn, formatAxiosErrorMessage, isMobilePhone } from '@/utils';

type PhoneProps = NativeStackScreenProps<OnboardingStackParamList, 'Phone'>;

const PhoneFormSchema = z.object({
  phone: z.string().refine(phone => isMobilePhone(phone, 'en-NG'), {
    message: 'Please enter a valid Nigerian phone number.',
  }),
});

type PhoneFormValues = z.infer<typeof PhoneFormSchema>;

export const Phone: React.FunctionComponent<PhoneProps> = ({ navigation }) => {
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
        navigation.navigate('CardDetails');
      },

      onError: error => {
        const errorMessage = formatAxiosErrorMessage(error as AxiosError);

        if (errorMessage) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

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

  const isKeyboardOpen = useKeyboardVisibility();

  return (
    <>
      <Screen isHeaderShown={false} hasLogoFooter>
        <KeyboardAwareScrollView keyboardDismissMode="interactive">
          <PaddedScreenHeader
            heading="What's your phone number?"
            subHeading="Use a number your friends have. It'll help them find you easily on Halver."
            hasExtraPadding
          />

          <View className="mt-10 p-2 px-6 pb-20">
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
              <TextFieldError errorMessage={errors.phone?.message} fieldName="your phone number" />
            )}

            {!isKeyboardOpen && (
              <Animated.View entering={FadeInDown.duration(200)}>
                <Button
                  className="mt-12"
                  color="casal"
                  disabled={isUserDetailsUpdateLoading || isKeyboardOpen}
                  isTextContentOnly
                  onPress={handleSubmit(onSubmit)}
                >
                  {isUserDetailsUpdateLoading ? 'Loading...' : 'Continue'}
                </Button>
              </Animated.View>
            )}
          </View>
        </KeyboardAwareScrollView>

        {isKeyboardOpen && (
          <KeyboardStickyView className={cn(isKeyboardOpen ? 'opacity-100' : 'opacity-0')}>
            <Animated.View entering={FadeInUp.duration(200)}>
              <Button
                className="rounded-none"
                color="casal"
                disabled={isUserDetailsUpdateLoading || !isKeyboardOpen}
                isTextContentOnly
                onPress={handleSubmit(onSubmit)}
              >
                {isUserDetailsUpdateLoading ? 'Loading...' : 'Continue'}
              </Button>
            </Animated.View>
          </KeyboardStickyView>
        )}
      </Screen>
    </>
  );
};
