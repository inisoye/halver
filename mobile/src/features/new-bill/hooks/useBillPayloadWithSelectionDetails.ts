import { useMMKVObject } from 'react-native-mmkv';

import { allMMKVKeys } from '@/lib/mmkv';

import { BillCreationMMKVPayload } from '../types';

export const useBillPayloadWithSelectionDetails = () => {
  const [newBillPayload, setNewBillPayload] = useMMKVObject<BillCreationMMKVPayload>(
    allMMKVKeys.newBillPayload,
  );

  const selectedRegisteredParticipants = newBillPayload?.registeredParticipants;
  const selectedUnregisteredParticipants = newBillPayload?.unregisteredParticipants;

  const selectedRegisteredParticipantsLength = selectedRegisteredParticipants
    ? selectedRegisteredParticipants.length
    : 0;
  const selectedUnregisteredParticipantsLength = selectedUnregisteredParticipants
    ? selectedUnregisteredParticipants.length
    : 0;

  const numberOfSelections =
    selectedRegisteredParticipants && selectedUnregisteredParticipants
      ? selectedRegisteredParticipantsLength + selectedUnregisteredParticipantsLength
      : 0;

  const pluralDenoter = !!numberOfSelections && numberOfSelections !== 1 ? 's' : '';

  return {
    newBillPayload,
    numberOfSelections,
    pluralDenoter,
    selectedRegisteredParticipants,
    selectedRegisteredParticipantsLength,
    selectedUnregisteredParticipants,
    selectedUnregisteredParticipantsLength,
    setNewBillPayload,
  };
};
