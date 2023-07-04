import {
  DefinedRegisteredParticipant,
  DefinedUnregisteredParticipant,
  FormattedRegisteredParticipant,
  RegisteredParticipants,
  UnregisteredParticipants,
} from '../types';

export function calculateEvenAmounts(amount: number, divisions: number) {
  const division = Math.floor(amount / divisions);
  const remainder = amount % divisions;

  const divisionsArray = Array(divisions).fill(division);

  // Distribute the remainder among divisions
  for (let i = 0; i < remainder; i++) {
    divisionsArray[i]++; // Increment the division
  }

  return divisionsArray;
}

export function removeDuplicateParticipants(
  participants: RegisteredParticipants | undefined,
  creatorDetails?: FormattedRegisteredParticipant,
) {
  if (!participants) return [];

  const uniqueParticipantsSet = new Set<string>();
  const uniqueParticipants: DefinedRegisteredParticipant[] = [];

  participants.forEach(participant => {
    if (
      !uniqueParticipantsSet.has(participant.phone) &&
      participant.uuid !== creatorDetails?.uuid
    ) {
      uniqueParticipantsSet.add(participant.phone);

      uniqueParticipants.push(participant);
    }
  });

  return uniqueParticipants;
}

export function removeDuplicateUnregisteredParticipants(
  participants: UnregisteredParticipants | undefined,
  creatorDetails?: FormattedRegisteredParticipant,
) {
  if (!participants) return [];

  const uniqueParticipantsSet = new Set<string>();
  const uniqueParticipants: DefinedUnregisteredParticipant[] = [];

  participants.forEach(participant => {
    if (
      !uniqueParticipantsSet.has(participant.phone) &&
      participant.phone !== creatorDetails?.phone
    ) {
      uniqueParticipantsSet.add(participant.phone);

      uniqueParticipants.push(participant);
    }
  });

  return uniqueParticipants;
}

interface FormParticipantContributions {
  registeredParticipants?:
    | {
        name?: string | undefined;
        phone?: string | undefined;
        uuid?: string | undefined;
        username?: string | undefined;
        profileImageUrl?: string | null | undefined;
        profileImageHash?: string | null | undefined;
        contribution?: string | undefined;
      }[]
    | undefined;
  unregisteredParticipants?:
    | {
        created?: string | undefined;
        modified?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        uuid?: string | undefined;
        contribution?: string | undefined;
      }[]
    | undefined;
}

export function sumTotalParticipantAllocations(
  participants: FormParticipantContributions,
): {
  registered: number;
  unregistered: number;
  total: number;
} {
  let registeredSum = 0;
  let unregisteredSum = 0;

  participants.registeredParticipants?.forEach(participant => {
    registeredSum += Number(participant.contribution);
  });

  participants.unregisteredParticipants?.forEach(participant => {
    unregisteredSum += Number(participant.contribution);
  });

  return {
    registered: registeredSum,
    unregistered: unregisteredSum,
    total: unregisteredSum + registeredSum,
  };
}
