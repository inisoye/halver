import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { WebViewNavigation } from 'react-native-webview';

import {
  Box,
  DynamicText,
  KeyboardStickyButton,
  PaddedScreenHeader,
  Screen,
  Text,
} from '@/components';
import {
  PaystackCardAdditionModal,
  useGetCardAdditionURL,
} from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { allStaticQueryKeys } from '@/lib/react-query';
import { showToast } from '@/lib/root-toast';
import { OnboardingStackParamList } from '@/navigation';

type CardDetailsProps = NativeStackScreenProps<OnboardingStackParamList, 'CardDetails'>;

export const CardDetails: React.FunctionComponent<CardDetailsProps> = ({
  navigation,
}) => {
  const {
    data: cardAdditionURLResponse,
    isLoading: isCardAdditionUrlLoading,
    isFetching: isCardAdditionUrlFetching,
  } = useGetCardAdditionURL();
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();
  const queryClient = useQueryClient();

  const { authorizationUrl } = cardAdditionURLResponse?.data || {};
  const callbackUrl = 'https://api.halverapp.com/';

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;

    if (!url) return;

    if (url.startsWith(callbackUrl)) {
      closeModal();
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getUserDetails });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getCardAdditionURL,
      });

      showToast('Card added successfully.');
      navigation.navigate('ProfileImage');
    }
  };

  const handleCloseModal = () => {
    closeModal();
    queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getUserDetails });
    queryClient.invalidateQueries({
      queryKey: allStaticQueryKeys.getCardAdditionURL,
    });
  };

  const isAddCardButtonDisabled = isCardAdditionUrlLoading || isCardAdditionUrlFetching;

  return (
    <>
      <Screen isHeaderShown={false} hasNoIOSBottomInset>
        <Box flex={1}>
          <PaddedScreenHeader
            heading="We also need your card"
            subHeading="You'll use this to make contributions on Halver."
            hasExtraPadding
          />

          <Text
            color="textLight"
            marginTop="1"
            paddingHorizontal="6"
            paddingVertical="2"
            variant="sm"
          >
            Adding your card is easy. Click the button below and follow Paystack's
            instructions. We'll need to charge you 60 Naira (NGN) to get it done, but
            don't worry - we'll attempt to refund* most of it right after your card is
            successfully added.
          </Text>

          <DynamicText
            color="textLight"
            marginTop="10"
            maxWidth={320}
            opacity={0.6}
            paddingHorizontal="6"
            paddingVertical="2"
            variant="xs"
          >
            *The refund excludes transaction charges and totals to about 38 Naira. All
            sensitive financial details are handled and stored by Paystack.
          </DynamicText>

          {!!authorizationUrl && (
            <PaystackCardAdditionModal
              authorizationUrl={authorizationUrl}
              closeModal={handleCloseModal}
              isModalOpen={isModalOpen}
              onNavigationStateChange={onNavigationStateChange}
            />
          )}
        </Box>

        <KeyboardStickyButton
          backgroundColor="buttonCasal"
          disabled={isAddCardButtonDisabled}
          onPress={openModal}
        >
          <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
            {isAddCardButtonDisabled ? 'Loading...' : 'Add card'}
          </Text>
        </KeyboardStickyButton>
      </Screen>
    </>
  );
};
