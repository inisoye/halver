import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useMMKVBoolean } from 'react-native-mmkv';

import { useUserDetails } from '@/features/account';
import { AddCardForm } from '@/features/financials';
import { allMMKVKeys } from '@/lib/mmkv';
import type { OnboardingStackParamList } from '@/navigation';

type CardDetailsProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'CardDetails'
>;

export const CardDetails: React.FunctionComponent<CardDetailsProps> = ({
  navigation,
}) => {
  const { data: userDetails } = useUserDetails();
  const [_isFirstTime, setIsFirstTime] = useMMKVBoolean(
    allMMKVKeys.isFirstTime,
  );

  const { profileImageHash, profileImageUrl } = userDetails || {};

  const isImageAlreadyUploaded = !!profileImageHash && !!profileImageUrl;

  const onAddCardComplete = React.useCallback(() => {
    if (isImageAlreadyUploaded) {
      setIsFirstTime(false);
    } else {
      navigation.navigate('ProfileImage');
    }
  }, [isImageAlreadyUploaded, navigation, setIsFirstTime]);

  return <AddCardForm isOnboarding onComplete={onAddCardComplete} />;
};
