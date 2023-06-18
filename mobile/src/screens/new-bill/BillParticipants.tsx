import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Contacts from 'expo-contacts';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';

import { Box, KeyboardStickyButton, Screen, Text, TextField } from '@/components';
import { Search } from '@/icons';
import { AppRootStackParamList } from '@/navigation';
import { isIOS } from '@/utils';

type BillParticipantsProps = NativeStackScreenProps<
  AppRootStackParamList,
  'Bill Participants'
>;

export const BillParticipants = ({ navigation }: BillParticipantsProps) => {
  const [contacts, setContacts] = React.useState<Contacts.Contact[]>([]);
  const { control: controlForContactFilter, resetField } = useForm();

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

  const namesAndNumbers = contacts
    .flatMap(contact => {
      const { name, phoneNumbers } = contact;
      return phoneNumbers?.map(phoneNumber => ({ name, phone: phoneNumber.digits }));
    })
    .filter(Boolean);

  return (
    <Screen hasNoIOSBottomInset>
      <ScrollView keyboardDismissMode="interactive">
        <Box paddingHorizontal="6">
          <Box
            borderBottomColor="modalFilterContainerBorder"
            borderBottomWidth={1}
            paddingBottom="5"
          >
            <TextField
              control={controlForContactFilter}
              name="contactFilter"
              paddingHorizontal="3"
              paddingVertical={isIOS() ? '2' : '1'}
              placeholder="Search"
              prefixComponent={<Search />}
              autoFocus
            />
          </Box>
        </Box>

        <Box paddingHorizontal="6" paddingVertical="2">
          <Text>This is bill participants</Text>
        </Box>
      </ScrollView>

      <KeyboardStickyButton
        backgroundColor="buttonCasal"
        onPress={() => navigation.navigate('Bill Details')}
      >
        <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
          Continue
        </Text>
      </KeyboardStickyButton>
    </Screen>
  );
};
