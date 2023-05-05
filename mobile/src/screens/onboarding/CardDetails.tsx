import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import * as React from 'react';
import { Modal } from 'react-native';
import { WebView } from 'react-native-webview';

import { Button, KeyboardStickyView, PaddedScreenHeader, Screen, Text } from '@/components';
import { useGetCardAdditionURL } from '@/features/financials';
import { useModalControl } from '@/hooks';
import { allQueryKeys } from '@/lib/react-query';
import { OnboardingStackParamList } from '@/navigation';
import { isIOS } from '@/utils';

type CardDetailsProps = NativeStackScreenProps<OnboardingStackParamList, 'CardDetails'>;

export const CardDetails: React.FunctionComponent<CardDetailsProps> = ({ navigation }) => {
  const { data: cardAdditionURLResponse, isLoading: isCardAdditionUrlLoading } =
    useGetCardAdditionURL();
  const { isModalOpen, openModal, closeModal } = useModalControl();
  const queryClient = useQueryClient();

  const { authorizationUrl } = cardAdditionURLResponse?.data || {};
  const callbackUrl = 'https://api.halverapp.com/';

  const onNavigationStateChange = state => {
    const { url } = state;

    if (!url) return;

    if (url.startsWith(callbackUrl)) {
      closeModal();
      queryClient.invalidateQueries({ queryKey: allQueryKeys.getUserDetails });
      navigation.navigate('BankAccountDetails');
    }
  };

  return (
    <>
      <Screen isHeaderShown={false} hasLogoFooter>
        <PaddedScreenHeader
          heading="We also need your card"
          subHeading="You'll use this to make contributions on Halver. You are in full control."
          hasExtraPadding
        />

        <Text className="mt-1 p-2 px-6" color="light" variant="sm">
          To add your card, click the button below and follow the Paystack instructions. You'll be
          charged 60 Naira (NGN), most of which* will be refunded after your card is added.
        </Text>

        <Text className="mt-1 max-w-xs p-2 px-6 opacity-60" color="light" variant="xs">
          *The refund excludes transaction charges and totals to about 38 Naira.
        </Text>

        {!!authorizationUrl && (
          <Modal animationType="fade" transparent={true} visible={isModalOpen}>
            <WebView
              source={{ uri: authorizationUrl }}
              style={{ marginTop: isIOS() ? Constants.statusBarHeight : 0 }}
              onNavigationStateChange={onNavigationStateChange}
            />
          </Modal>
        )}

        <KeyboardStickyView className="px-6">
          <Button
            className="mt-12"
            color="casal"
            disabled={isCardAdditionUrlLoading}
            isTextContentOnly
            onPress={() => {
              openModal();
            }}
          >
            {isCardAdditionUrlLoading ? 'Loading...' : 'Add card'}
          </Button>
        </KeyboardStickyView>
      </Screen>
    </>
  );
};
