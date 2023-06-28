import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Box, FullWidthTextField, LinearGradient, Screen } from '@/components';
import {
  ContactsContinueButton,
  ContactsList,
  ViewContactSelectionsModal,
} from '@/features/new-bill';
import { Search } from '@/icons';
import { AppRootStackParamList } from '@/navigation';
import { useIsDarkMode } from '@/utils';

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

  const isDarkMode = useIsDarkMode();

  const gradientColors = isDarkMode
    ? ['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)', 'black']
    : [
        'rgba(255,255,255,0)',
        'rgba(255,255,255,0.2)',
        'rgba(255,255,255,0.5)',
        'white',
      ];

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

      <Box
        bottom={0}
        flex={1}
        left={0}
        pointerEvents="none"
        position="absolute"
        right={0}
        top={0}
      >
        <LinearGradient
          bottom={0}
          colors={gradientColors}
          flex={1}
          left={0}
          locations={[0.5, 0.7, 0.9, 1]}
          position="absolute"
          right={0}
          top={0}
        />
      </Box>

      <ContactsContinueButton navigation={navigation} />
    </Screen>
  );
};
