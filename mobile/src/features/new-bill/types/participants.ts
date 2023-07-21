import { BillCreationMMKVPayload } from '../../bills/types/bills';

export type RegisteredParticipants = BillCreationMMKVPayload['registeredParticipants'];
export type DefinedRegisteredParticipant = Exclude<
  RegisteredParticipants,
  undefined
>[number];
export type FormattedRegisteredParticipant = Omit<
  DefinedRegisteredParticipant,
  'contribution'
> & { contribution: string };

export type UnregisteredParticipants =
  BillCreationMMKVPayload['unregisteredParticipants'];
export type DefinedUnregisteredParticipant = Exclude<
  UnregisteredParticipants,
  undefined
>[number];
export type FormattedUnregisteredParticipant = Omit<
  DefinedUnregisteredParticipant,
  'contribution'
> & { contribution: string };
