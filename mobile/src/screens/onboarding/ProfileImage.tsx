import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useMMKVBoolean } from 'react-native-mmkv';

import { EditProfileImageForm } from '@/features/account';
import { allMMKVKeys } from '@/lib/mmkv';
import type { OnboardingStackParamList } from '@/navigation';

type ProfileImageProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'ProfileImage'
>;

export const ProfileImage: React.FunctionComponent<ProfileImageProps> = () => {
  const [_hasCompletedOnboarding, setHasCompletedOnboarding] = useMMKVBoolean(
    allMMKVKeys.hasCompletedOnboarding,
  );

  const onComplete = React.useCallback(() => {
    setHasCompletedOnboarding(true);
  }, [setHasCompletedOnboarding]);

  return <EditProfileImageForm isOnboarding onComplete={onComplete} />;
};
