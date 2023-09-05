import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Box, FullWidthTextField, LogoLoader, Screen } from '@/components';
import {
  ContactsContinueButton,
  ContactsList,
  GradientOverlay,
  usePhoneContacts,
  ViewContactSelectionsModal,
} from '@/features/new-bill';
import { Search } from '@/icons';
import type { AppRootStackParamList } from '@/navigation';

type BillParticipantsProps = NativeStackScreenProps<
  AppRootStackParamList,
  'Select Participants'
>;

export const BillParticipants = ({ navigation }: BillParticipantsProps) => {
  const { isLoading: areContactsLoading } = usePhoneContacts();

  const { control: controlForContactFilter } = useForm<{
    contactFilter: string;
  }>({
    defaultValues: {
      contactFilter: '',
    },
  });

  const contactsFilterValue = useWatch({
    control: controlForContactFilter,
    name: 'contactFilter',
  });

  return (
    <Screen headerProps={{ paddingBottom: '2.5' }} hasNoIOSBottomInset>
      <Box backgroundColor="transparent" height={12}>
        {areContactsLoading && <LogoLoader />}
      </Box>

      <FullWidthTextField
        autoFocus={false}
        containerProps={{ marginTop: '0' }}
        control={controlForContactFilter}
        name="contactFilter"
        paddingHorizontal="0"
        placeholder="Search for a contact"
        prefixComponent={<Search />}
        suffixComponent={<ViewContactSelectionsModal navigation={navigation} />}
      />

      <ContactsList contactsFilterValue={contactsFilterValue} />

      <GradientOverlay />

      <ContactsContinueButton navigation={navigation} />
    </Screen>
  );
};
