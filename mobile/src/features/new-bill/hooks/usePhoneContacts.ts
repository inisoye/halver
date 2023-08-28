import { useQuery } from '@tanstack/react-query';
import * as Contacts from 'expo-contacts';

import { allStaticQueryKeys } from '@/lib/react-query';

const getPhoneContacts = async () => {
  const { status } = await Contacts.requestPermissionsAsync();

  if (status === 'granted') {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    return data || [];
  }

  return [];
};

export function usePhoneContacts() {
  return useQuery({
    queryKey: allStaticQueryKeys.getPhoneContacts,
    queryFn: getPhoneContacts,
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
  });
}
