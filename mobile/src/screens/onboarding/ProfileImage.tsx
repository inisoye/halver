import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import { EditProfileImageForm } from '@/features/account';
import { prefetchActionStatusCounts } from '@/features/home';
import type { OnboardingStackParamList } from '@/navigation';

type ProfileImageProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'ProfileImage'
>;

export const ProfileImage: React.FunctionComponent<ProfileImageProps> = ({
  navigation,
}) => {
  const queryClient = useQueryClient();

  const handleGoToWelcome = () => {
    prefetchActionStatusCounts(queryClient);
    navigation.navigate('Welcome');
  };

  return <EditProfileImageForm isOnboarding onComplete={handleGoToWelcome} />;
};
