import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useMMKVBoolean } from 'react-native-mmkv';

import { useUserDetails } from '@/features/account';
import { AddTransferRecipientForm } from '@/features/financials';
import { allMMKVKeys } from '@/lib/mmkv';
import type { OnboardingStackParamList } from '@/navigation';

type BankAcountDetailsProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'BankAccountDetails'
>;

export const BankAccountDetails: React.FunctionComponent<
  BankAcountDetailsProps
> = ({ navigation }) => {
  const { data: userDetails } = useUserDetails();
  const [_isFirstTime, setIsFirstTime] = useMMKVBoolean(
    allMMKVKeys.isFirstTime,
  );

  const { profileImageHash, profileImageUrl, defaultCard } = userDetails || {};

  const isCardAlreadySaved = !!defaultCard;
  const isImageAlreadyUploaded = !!profileImageHash && !!profileImageUrl;

  const onAddTransferRecipientComplete = React.useCallback(() => {
    if (!isCardAlreadySaved) {
      navigation.navigate('CardDetails');
      return;
    }

    if (!isImageAlreadyUploaded) {
      navigation.navigate('ProfileImage');
      return;
    }

    if (isCardAlreadySaved && isImageAlreadyUploaded) {
      setIsFirstTime(false);
      return;
    }
  }, [isCardAlreadySaved, isImageAlreadyUploaded, navigation, setIsFirstTime]);

  return (
    <AddTransferRecipientForm
      isOnboarding
      onComplete={onAddTransferRecipientComplete}
    />
  );
};
