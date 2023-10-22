import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import { useUserDetails } from '@/features/account';
import { AddCardForm } from '@/features/financials';
import { prefetchActionStatusCounts } from '@/features/home';
import type { OnboardingStackParamList } from '@/navigation';

type CardDetailsProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'CardDetails'
>;

export const CardDetails: React.FunctionComponent<CardDetailsProps> = ({
  navigation,
}) => {
  const queryClient = useQueryClient();

  const { data: userDetails } = useUserDetails();

  const { profileImageHash, profileImageUrl } = userDetails || {};

  const isImageAlreadyUploaded = !!profileImageHash && !!profileImageUrl;

  const onAddCardComplete = React.useCallback(() => {
    if (isImageAlreadyUploaded) {
      prefetchActionStatusCounts(queryClient);
      navigation.navigate('Welcome');
    } else {
      navigation.navigate('ProfileImage');
    }
  }, [isImageAlreadyUploaded, navigation, queryClient]);

  return <AddCardForm isOnboarding onComplete={onAddCardComplete} />;
};
