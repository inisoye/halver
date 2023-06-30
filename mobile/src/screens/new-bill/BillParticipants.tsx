import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { FullWidthTextField, Screen } from '@/components';
import {
  ContactsContinueButton,
  ContactsList,
  GradientOverlay,
  ViewContactSelectionsModal,
} from '@/features/new-bill';
import { Search } from '@/icons';
import { AppRootStackParamList } from '@/navigation';

type BillParticipantsProps = NativeStackScreenProps<
  AppRootStackParamList,
  'Select Participants'
>;

export const BillParticipants = ({ navigation }: BillParticipantsProps) => {
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
    <Screen hasNoIOSBottomInset>
      <FullWidthTextField
        autoFocus={false}
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
