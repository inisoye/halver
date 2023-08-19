import * as React from 'react';
import { Alert } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';

import { DynamicText, TouchableOpacity } from '@/components';
import { deleteAxiosDefaultToken } from '@/lib/axios';
import { allMMKVKeys, storage } from '@/lib/mmkv';

export const LogoutButton: React.FunctionComponent = () => {
  const [_token, setToken] = useMMKVString(allMMKVKeys.token);

  const logOut = () => {
    setToken(undefined);
    storage.clearAll();
    deleteAxiosDefaultToken();
  };

  const createTwoButtonAlert = () =>
    Alert.alert(
      'Are you sure?',
      'All your data and preferences on this phone will be deleted',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Continue', onPress: () => logOut() },
      ],
    );

  return (
    <TouchableOpacity
      alignItems="center"
      backgroundColor="elementBackground"
      borderColor="borderDefault"
      borderRadius="md"
      borderTopWidth={true ? undefined : 1}
      flexDirection="row"
      gap="4"
      justifyContent="space-between"
      padding="4"
      paddingVertical="3"
      onPress={createTwoButtonAlert}
    >
      <DynamicText
        fontFamily="Halver-Semibold"
        maxWidth="60%"
        numberOfLines={1}
        textAlign="right"
        variant="sm"
      >
        Log out
      </DynamicText>
    </TouchableOpacity>
  );
};
