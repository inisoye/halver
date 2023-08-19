import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { EditProfileImageForm } from '@/features/account';
import { AccountStackParamList } from '@/navigation';

type EditProfileImageProps = NativeStackScreenProps<
  AccountStackParamList,
  'Edit profile image'
>;

export const EditProfileImage: React.FunctionComponent<EditProfileImageProps> = ({
  navigation,
}) => {
  const handleGoToAccount = () => {
    navigation.navigate('Account');
  };

  return <EditProfileImageForm onComplete={handleGoToAccount} />;
};
