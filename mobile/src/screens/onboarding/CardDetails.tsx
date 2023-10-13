import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { AddCardForm } from '@/features/financials';
import type { OnboardingStackParamList } from '@/navigation';

type CardDetailsProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'CardDetails'
>;

export const CardDetails: React.FunctionComponent<CardDetailsProps> = ({
  navigation,
}) => {
  const onAddCardComplete = React.useCallback(() => {
    navigation.navigate('ProfileImage');
  }, [navigation]);

  return <AddCardForm isOnboarding onComplete={onAddCardComplete} />;
};
