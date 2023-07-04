import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import * as Contacts from 'expo-contacts';
import parsePhoneNumberFromString from 'libphonenumber-js';
import * as React from 'react';

import { AbsoluteKeyboardStickyButton, Text } from '@/components';
import { showToast } from '@/lib/root-toast';
import { AppRootStackParamList } from '@/navigation';
import { isMobilePhone, removeSpaces } from '@/utils';

import { useRegisteredContacts } from '../api';
import { useBillPayloadWithSelectionDetails } from '../hooks';
import { ContactRenderItem } from './ContactRenderItem';

interface ContactsListProps {
  contactsFilterValue: string;
}

export function ContactsList({ contactsFilterValue }: ContactsListProps) {
  const [contacts, setContacts] = React.useState<Contacts.Contact[]>([]);

  React.useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);

  const allContacts = React.useMemo(() => {
    const namesAndNumbers = contacts
      .flatMap(contact => {
        const { name, phoneNumbers } = contact;

        return phoneNumbers?.map(phoneNumber => {
          const numberWithoutSpaces = removeSpaces(phoneNumber?.number || '');

          return {
            fullName: name,
            phone: isMobilePhone(numberWithoutSpaces, 'en-NG')
              ? parsePhoneNumberFromString(numberWithoutSpaces, 'NG')?.format('E.164')
              : undefined,
          };
        });
      })
      .filter(item => !!item?.phone); // Remove falsy values

    const phoneNumbers = namesAndNumbers.map(c => c?.phone || '');

    return { namesAndNumbers, phoneNumbers };
  }, [contacts]);

  const { registeredContacts, filteredRegisteredContacts } = useRegisteredContacts({
    allContacts,
    contactsFilterValue,
  });

  // Remove registered contacts from unregistered list.
  const allUnregisteredContacts = React.useMemo(() => {
    const registeredContactsSet = new Set(
      registeredContacts?.map(item => item.phone || undefined),
    );
    return allContacts.namesAndNumbers.filter(
      item => !registeredContactsSet.has(item?.phone),
    );
  }, [allContacts.namesAndNumbers, registeredContacts]);

  const filteredUnregisteredContacts = React.useMemo(() => {
    return allUnregisteredContacts.filter(contact =>
      contact?.fullName?.toLowerCase().includes(contactsFilterValue?.toLowerCase()),
    );
  }, [allUnregisteredContacts, contactsFilterValue]);

  const noContactsFound =
    (!filteredRegisteredContacts || filteredRegisteredContacts?.length < 1) &&
    (!filteredUnregisteredContacts || filteredUnregisteredContacts?.length < 1);

  const contactsWithHeadings = React.useMemo(() => {
    if (noContactsFound) {
      return [undefined];
    }

    if (!filteredRegisteredContacts || filteredRegisteredContacts?.length < 1) {
      return ['Contacts', ...filteredUnregisteredContacts];
    }

    if (!filteredUnregisteredContacts || filteredUnregisteredContacts?.length < 1) {
      return ['Contacts on Halver', ...filteredRegisteredContacts];
    }

    return [
      'Contacts on Halver',
      ...filteredRegisteredContacts,
      'Other contacts',
      ...filteredUnregisteredContacts,
    ];
  }, [filteredRegisteredContacts, noContactsFound, filteredUnregisteredContacts]);

  const stickyHeaderIndices = React.useMemo(
    () =>
      contactsWithHeadings
        .map((item, index) => {
          if (typeof item === 'string') {
            return index;
          } else {
            return null;
          }
        })
        .filter(item => item !== null) as number[],
    [contactsWithHeadings],
  );

  const renderItem = ({ item, index }) => {
    const isLastItem = index === contactsWithHeadings.length - 1;

    return <ContactRenderItem index={index} isLastItem={isLastItem} item={item} />;
  };

  return (
    <>
      {noContactsFound && (
        <Text color="textLight" padding="6">
          We found no contacts
          {!!contactsFilterValue && ` matching "${contactsFilterValue}"`}
        </Text>
      )}

      <FlashList
        data={contactsWithHeadings}
        estimatedItemSize={90}
        getItemType={item => {
          return typeof item === 'string' ? 'sectionHeader' : 'row';
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        renderItem={renderItem}
        stickyHeaderIndices={stickyHeaderIndices}
      />
    </>
  );
}

interface ContactsContinueButtonProps {
  navigation: NativeStackNavigationProp<
    AppRootStackParamList,
    'Select Participants',
    undefined
  >;
}

export const ContactsContinueButton: React.FunctionComponent<
  ContactsContinueButtonProps
> = ({ navigation }) => {
  const { numberOfSelections, pluralDenoter } = useBillPayloadWithSelectionDetails();

  const handleContinue = () => {
    if (numberOfSelections < 1) {
      showToast('Please select a participant first', 'error');
      return;
    }

    navigation.navigate('Split Breakdown');
  };

  return (
    <AbsoluteKeyboardStickyButton
      backgroundColor="buttonCasal"
      position="absolute"
      onPress={handleContinue}
    >
      <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
        Continue
        {numberOfSelections >= 1 && ` with ${numberOfSelections} selection`}
        {pluralDenoter}
      </Text>
    </AbsoluteKeyboardStickyButton>
  );
};
