import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import { useUserDetails } from '@/features/account';
import {
  AddTransferRecipientForm,
  prefetchCardAdditionURL,
} from '@/features/financials';
import { prefetchActionStatusCounts } from '@/features/home';
import type { OnboardingStackParamList } from '@/navigation';

type BankAcountDetailsProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'BankAccountDetails'
>;

export const BankAccountDetails: React.FunctionComponent<
  BankAcountDetailsProps
> = ({ navigation }) => {
  const queryClient = useQueryClient();

  const { data: userDetails } = useUserDetails();

  const { profileImageHash, profileImageUrl, defaultCard } = userDetails || {};

  const isCardAlreadySaved = !!defaultCard;
  const isImageAlreadyUploaded = !!profileImageHash && !!profileImageUrl;

  const onAddTransferRecipientComplete = React.useCallback(() => {
    if (!isCardAlreadySaved) {
      prefetchCardAdditionURL(queryClient);
      navigation.navigate('CardDetails');
      return;
    }

    if (!isImageAlreadyUploaded) {
      navigation.navigate('ProfileImage');
      return;
    }

    if (isCardAlreadySaved && isImageAlreadyUploaded) {
      prefetchActionStatusCounts(queryClient);
      navigation.navigate('Welcome');
      return;
    }
  }, [isCardAlreadySaved, isImageAlreadyUploaded, navigation, queryClient]);

  return (
    <AddTransferRecipientForm
      isOnboarding
      onComplete={onAddTransferRecipientComplete}
    />
  );
};
