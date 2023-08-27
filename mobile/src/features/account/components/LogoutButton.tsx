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
      'All your data and preferences on this phone will be deleted.',
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
      alignSelf="center"
      backgroundColor="elementBackground"
      borderColor="borderDefault"
      borderRadius="md"
      flexDirection="row"
      gap="4"
      justifyContent="center"
      paddingHorizontal="4"
      paddingVertical="2"
      onPress={createTwoButtonAlert}
    >
      <DynamicText
        color="red11"
        fontFamily="Halver-Semibold"
        maxWidth="60%"
        numberOfLines={1}
        textAlign="center"
        variant="xs"
      >
        Log out
      </DynamicText>
    </TouchableOpacity>
  );
};
