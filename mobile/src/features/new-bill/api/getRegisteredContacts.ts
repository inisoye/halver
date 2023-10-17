import { useMutation } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import * as React from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import { z } from 'zod';

import { useUserDetails } from '@/features/account';
import { useRefreshOnFocus } from '@/hooks';
import { apiClient } from '@/lib/axios';
import { allMMKVKeys } from '@/lib/mmkv';
import { RegisteredContactsList as RegisteredContactsListSchema } from '@/lib/zod';
import { handleAxiosErrorAlertAndHaptics } from '@/utils';

export type RegisteredContactsList = z.infer<
  typeof RegisteredContactsListSchema
>;

export const getRegisteredContacts = async (phoneNumbers: string[]) => {
  const response = await apiClient.post('/accounts/registered-contacts/', {
    phoneNumbers,
  });
  return RegisteredContactsListSchema.parse(response.data);
};

export const useRegisteredContactsRequest = () => {
  return useMutation({
    mutationFn: getRegisteredContacts,
  });
};

interface UseRegisteredContactsParams {
  allContacts: {
    namesAndNumbers: (
      | {
          fullName: string;
          phone: string | false | undefined;
        }
      | undefined
    )[];
    phoneNumbers: string[];
  };
  contactsFilterValue: string;
}

export const useRegisteredContacts = ({
  allContacts,
  contactsFilterValue,
}: UseRegisteredContactsParams) => {
  const [registeredContacts, setRegisteredContacts] =
    useMMKVObject<RegisteredContactsList>(allMMKVKeys.registeredContacts);
  const { data: creatorDetails } = useUserDetails();

  const filteredRegisteredContacts = React.useMemo(() => {
    return registeredContacts?.filter(
      contact =>
        contact?.fullName
          ?.toLowerCase()
          .includes(contactsFilterValue?.toLowerCase()) &&
        contact.uuid !== creatorDetails?.uuid, // Remove creator
    );
  }, [contactsFilterValue, creatorDetails?.uuid, registeredContacts]);

  // A mutation/POST request is used because a large amount of data (contacts) is sent over the wire.
  const {
    mutate: requestRegisteredContacts,
    isLoading: areRegisteredContactsLoading,
  } = useRegisteredContactsRequest();

  const getAndUpdateContacts = React.useCallback(() => {
    if (allContacts.phoneNumbers.length > 0) {
      requestRegisteredContacts(allContacts.phoneNumbers, {
        onSuccess: data => {
          setRegisteredContacts(data);
        },
        onError: error => {
          handleAxiosErrorAlertAndHaptics(
            'Error fetching registered contacts',
            error as AxiosError,
          );
        },
      });
    }
  }, [
    requestRegisteredContacts,
    allContacts.phoneNumbers,
    setRegisteredContacts,
  ]);

  React.useEffect(() => {
    getAndUpdateContacts();
  }, [getAndUpdateContacts]);

  useRefreshOnFocus(getAndUpdateContacts);

  return {
    registeredContacts,
    filteredRegisteredContacts,
    areRegisteredContactsLoading,
  };
};
