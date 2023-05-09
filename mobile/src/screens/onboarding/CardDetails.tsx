import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { View } from 'react-native';
import { WebViewNavigation } from 'react-native-webview';

import { KeyboardStickyButton, PaddedScreenHeader, Screen, Text } from '@/components';
import { PaystackCardAdditionModal, useGetCardAdditionURL } from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { allStaticQueryKeys } from '@/lib/react-query';
import { OnboardingStackParamList } from '@/navigation';

type CardDetailsProps = NativeStackScreenProps<OnboardingStackParamList, 'CardDetails'>;

export const CardDetails: React.FunctionComponent<CardDetailsProps> = ({ navigation }) => {
  const { data: cardAdditionURLResponse, isLoading: isCardAdditionUrlLoading } =
    useGetCardAdditionURL();
  const { state: isModalOpen, setTrue: openModal, setFalse: closeModal } = useBooleanStateControl();
  const queryClient = useQueryClient();

  const { authorizationUrl } = cardAdditionURLResponse?.data || {};
  const callbackUrl = 'https://api.halverapp.com/';

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;

    if (!url) return;

    if (url.startsWith(callbackUrl)) {
      closeModal();
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getUserDetails });
      navigation.navigate('ProfileImage');
    }
  };

  return (
    <>
      <Screen isHeaderShown={false} hasNoIOSBottomInset>
        <View className="flex-1">
          <PaddedScreenHeader
            heading="We also need your card"
            subHeading="You'll use this to make contributions on Halver."
            hasExtraPadding
          />

          <Text className="mt-1 p-2 px-6" color="light" variant="sm">
            Adding your card is easy. Click the button below and follow Paystack's instructions.
            We'll need to charge you 60 Naira (NGN) to get it done, but don't worry - we'll attempt
            to refund most of it right after your card is successfully added.
          </Text>

          <Text className="mt-10 max-w-xs p-2 px-6 opacity-60" color="light" variant="xs">
            *The refund excludes transaction charges and totals to about 38 Naira. All financial
            details are handled and stored by Paystack.
          </Text>

          {!!authorizationUrl && (
            <PaystackCardAdditionModal
              authorizationUrl={authorizationUrl}
              closeModal={closeModal}
              isModalOpen={isModalOpen}
              onNavigationStateChange={onNavigationStateChange}
            />
          )}
        </View>

        <KeyboardStickyButton
          disabled={isCardAdditionUrlLoading}
          isTextContentOnly
          onPress={openModal}
        >
          {isCardAdditionUrlLoading ? 'Loading...' : 'Add card'}
        </KeyboardStickyButton>
      </Screen>
    </>
  );
};
