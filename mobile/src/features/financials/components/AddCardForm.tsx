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
import { useBooleanStateControl } from '@/hooks';
import { allStaticQueryKeys } from '@/lib/react-query';
import { showToast } from '@/lib/root-toast';

import { useGetCardAdditionURL } from '../api';
import { PaystackCardAdditionModal } from './PaystackCardAdditionModal';

interface AddCardFormProps {
  onComplete: () => void;
  isOnboarding?: boolean;
}

export const AddCardForm: React.FunctionComponent<AddCardFormProps> =
  React.memo(({ onComplete, isOnboarding = false }) => {
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
        queryClient.invalidateQueries({
          queryKey: allStaticQueryKeys.getUserDetails,
        });
        queryClient.invalidateQueries({
          queryKey: allStaticQueryKeys.getCardAdditionURL,
        });
        queryClient.invalidateQueries({
          queryKey: allStaticQueryKeys.getCards,
        });

        showToast('Card added successfully.');
        onComplete();
      }
    };

    const handleCloseModal = () => {
      closeModal();
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getUserDetails,
      });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getCardAdditionURL,
      });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getCards,
      });
    };

    const isAddCardButtonDisabled =
      isCardAdditionUrlLoading || isCardAdditionUrlFetching;

    return (
      <>
        <Screen isHeaderShown={!isOnboarding} hasNoIOSBottomInset>
          <Box flex={1}>
            {isOnboarding && (
              <PaddedScreenHeader
                handleSkip={onComplete}
                heading="We also need your card"
                step="Step 3/4"
                subHeading="You'll use this to make contributions on Halver."
                isSkippable
              />
            )}

            <Text
              color="textLight"
              lineHeight={19}
              marginBottom="6"
              marginTop="1"
              paddingHorizontal="6"
              paddingVertical="2"
              variant="sm"
            >
              Adding your card is easy. Just click the button below, follow
              Paystack's steps, and pay a 60 Naira fee. We'll process a refund*
              after your card is added.
            </Text>

            <Box
              backgroundColor="buttonPharlap"
              borderRadius="md"
              marginHorizontal="6"
              padding="4"
            >
              <Text color="buttonTextPharlap" lineHeight={18} variant="sm">
                Card additions may take a moment. Please wait briefly before
                trying again.
              </Text>
            </Box>

            <DynamicText
              color="textLight"
              marginTop="10"
              maxWidth={320}
              opacity={0.6}
              paddingHorizontal="6"
              paddingVertical="2"
              variant="xs"
            >
              *The refund excludes transaction charges and totals to about 38
              Naira.
            </DynamicText>
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

        {!!authorizationUrl && (
          <PaystackCardAdditionModal
            authorizationUrl={authorizationUrl}
            closeModal={handleCloseModal}
            isModalOpen={isModalOpen}
            onNavigationStateChange={onNavigationStateChange}
          />
        )}
      </>
    );
  });
