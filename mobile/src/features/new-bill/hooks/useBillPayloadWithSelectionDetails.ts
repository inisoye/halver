import * as React from 'react';
import { useMMKVObject } from 'react-native-mmkv';

import { useUserDetails } from '@/features/account';
import { allMMKVKeys } from '@/lib/mmkv';

import { BillCreationMMKVPayload } from '../types';

export const useBillPayloadWithSelectionDetails = () => {
  const [newBillPayload, setNewBillPayload] = useMMKVObject<BillCreationMMKVPayload>(
    allMMKVKeys.newBillPayload,
  );
  const { data: creatorDetails } = useUserDetails();

  const selectedRegisteredParticipants = newBillPayload?.registeredParticipants;
  const selectedRegisteredParticipantsExcludingCreator = React.useMemo(
    () =>
      selectedRegisteredParticipants?.filter(
        participant => participant.uuid !== creatorDetails?.uuid,
      ),
    [creatorDetails?.uuid, selectedRegisteredParticipants],
  );
  const selectedUnregisteredParticipants = newBillPayload?.unregisteredParticipants;

  const selectedRegisteredParticipantsLength = selectedRegisteredParticipants
    ? selectedRegisteredParticipants.length
    : 0;
  const selectedRegisteredParticipantsExcludingCreatorLength =
    selectedRegisteredParticipantsExcludingCreator
      ? selectedRegisteredParticipantsExcludingCreator.length
      : 0;
  const selectedUnregisteredParticipantsLength = selectedUnregisteredParticipants
    ? selectedUnregisteredParticipants.length
    : 0;

  const numberOfSelections =
    selectedRegisteredParticipants && selectedUnregisteredParticipants
      ? selectedRegisteredParticipantsLength + selectedUnregisteredParticipantsLength
      : 0;
  const numberOfSelectionsExcludingCreator =
    selectedRegisteredParticipantsExcludingCreator && selectedUnregisteredParticipants
      ? selectedRegisteredParticipantsExcludingCreatorLength +
        selectedUnregisteredParticipantsLength
      : 0;

  const pluralDenoter = !!numberOfSelections && numberOfSelections !== 1 ? 's' : '';
  const pluralExcludingCreatorDenoter =
    !!numberOfSelectionsExcludingCreator && numberOfSelectionsExcludingCreator !== 1
      ? 's'
      : '';

  return {
    newBillPayload,
    numberOfSelections,
    pluralDenoter,
    selectedRegisteredParticipants,
    selectedRegisteredParticipantsLength,
    selectedUnregisteredParticipants,
    selectedUnregisteredParticipantsLength,
    numberOfSelectionsExcludingCreator,
    selectedRegisteredParticipantsExcludingCreator,
    selectedRegisteredParticipantsExcludingCreatorLength,
    setNewBillPayload,
    pluralExcludingCreatorDenoter,
  };
};
