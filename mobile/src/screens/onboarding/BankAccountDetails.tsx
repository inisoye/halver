import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import type { AxiosError } from 'axios';
import { Image } from 'expo-image';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated from 'react-native-reanimated';
import { z } from 'zod';

import {
  Button,
  KeyboardStickyView,
  Modal,
  PaddedScreenHeader,
  Screen,
  Text,
  TextField,
  TextFieldError,
  TextFieldLabel,
} from '@/components';
import { useBanks, useCreateTransferRecipient } from '@/features/financials';
import { useBooleanStateControl, useButtonAnimation } from '@/hooks';
import { Search, SelectCaret } from '@/icons';
import { PaystackBank } from '@/lib/zod';
import type { OnboardingStackParamList } from '@/navigation';
import { cn, formatAxiosErrorMessage, isIOS } from '@/utils';

type BankAcountDetailsProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'BankAccountDetails'
>;

const BankDetailsFormSchema = z.object({
  accountNumber: z.string(),
  bank: PaystackBank,
});

type BankDetailsFormValues = z.infer<typeof BankDetailsFormSchema>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
// const KeyboardAwareFlashList = ScrollableComponent(FlashList);

export const BankAccountDetails: React.FunctionComponent<BankAcountDetailsProps> = (
  {
    // navigation,
  },
) => {
  const {
    control,
    // handleSubmit,
    formState: { errors },
  } = useForm<BankDetailsFormValues>({
    defaultValues: { accountNumber: undefined, bank: undefined },
    resolver: zodResolver(BankDetailsFormSchema),
  });
  const { control: controlForSelectFilter } = useForm();
  const { data: banks, isLoading: areBanksLoading } = useBanks();

  const { mutate: createTransferRecipient, isLoading: isCreateTransferRecipientLoading } =
    useCreateTransferRecipient();

  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl(true);

  // const onSubmit = (data: BankDetailsFormValues) => {
  //   createTransferRecipient(data, {
  //     onSuccess: () => {
  //       navigation.navigate('CardDetails');
  //     },

  //     onError: error => {
  //       const errorMessage = formatAxiosErrorMessage(error as AxiosError);

  //       if (errorMessage) {
  //         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

  //         Alert.alert('Error Adding Phone Number', errorMessage, [
  //           {
  //             text: 'OK',
  //             style: 'default',
  //           },
  //         ]);
  //       }
  //     },
  //   });
  // };

  // const BankRenderItem: ListRenderItem<Breed> = ({ item }) => {
  //   return <Cat id={item.id} name={item.name} uri={item.image?.url} />;
  // };

  return (
    <Screen isHeaderShown={false}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <PaddedScreenHeader
          heading="Your bank account details"
          subHeading="This will be where you'll get paid on Halver. You can always change it or add more later."
          hasExtraPadding
        />
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View className="mt-10 p-2 px-6 pb-20" style={{ gap: 28 }}>
          <View>
            <TextFieldLabel label="Your account number" />
            <TextField
              control={control}
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
            <TextFieldLabel label="Your bank" />
            <Button
              className={cn('mt-1.5 px-4 ', isIOS() ? 'py-[9.6px]' : 'py-3.5')}
              color="neutral"
              isTextContentOnly={false}
              onPress={openModal}
            >
              <Text className="opacity-0">Select a bank</Text>
              <SelectCaret className="ml-auto" />
            </Button>

            <Modal
              closeModal={closeModal}
              headingText="Select a bank"
              isLoaderOpen={areBanksLoading}
              isModalOpen={isModalOpen}
              hasLargeHeading
            >
              <View className="flex-1 bg-grey-light-50 px-6 py-3 dark:bg-grey-dark-50">
                <View
                  className={cn(
                    'border-b border-b-grey-light-300 pb-5 dark:border-b-grey-dark-400',
                    areBanksLoading && 'opacity-0',
                  )}
                >
                  <TextField
                    className="bg-grey-light-300 p-2 px-3 dark:bg-grey-dark-200"
                    control={controlForSelectFilter}
                    name="bankFilter"
                    placeholder="Search"
                    prefixComponent={<Search />}
                  />
                </View>

                <FlashList
                  data={banks}
                  estimatedItemSize={108}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => {
                    return (
                      <AnimatedPressable
                        className="flex-row items-center py-4"
                        style={[{ gap: 12 }]} // eslint-disable-line react-native/no-inline-styles
                        onPress={() => console.log(item)}
                      >
                        <Image
                          className="h-10 w-10 rounded-lg bg-white"
                          contentFit="contain"
                          source={item.logo}
                        />

                        <Text className="flex-shrink leading-[20px]">{item.name}</Text>
                      </AnimatedPressable>
                    );
                  }}
                  onScrollBeginDrag={() => Keyboard.dismiss()}
                />
              </View>
            </Modal>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView className="mt-12 px-6">
        <Button
          color="casal"
          disabled={areBanksLoading || isCreateTransferRecipientLoading}
          isTextContentOnly
          onPress={() => console.log('pressed')}
        >
          {areBanksLoading || isCreateTransferRecipientLoading ? 'Loading...' : 'Continue'}
        </Button>
      </KeyboardStickyView>
    </Screen>
  );
};
