import {
  DefinedRegisteredParticipant,
  DefinedUnregisteredParticipant,
  RegisteredParticipants,
  UnregisteredParticipants,
} from '../types';

/**
 * Calculates even amounts for each participant based on the bill amount and number of participants.
 * @param billAmount - The total bill amount.
 * @param numParticipants - The number of participants.
 * @returns An array of even contributions for each participant.
 */
export function calculateEvenAmounts(
  billAmount: number,
  numParticipants: number,
): number[] {
  const MULTIPLIER = 100; // Used for convert amounts from decimal and back.

  const evenContribution = Math.floor((billAmount * MULTIPLIER) / numParticipants);

  const remainingAmount = (billAmount * MULTIPLIER) % numParticipants;

  const contributions: number[] = [];

  for (let i = 0; i < numParticipants; i++) {
    contributions.push(evenContribution);
  }

  let remaining = remainingAmount;
  let index = 0;

  // Distribute the remaining amount among participants
  while (remaining > 0) {
    contributions[index]++;

    remaining--;

    // Move to the next participant using modulo operator
    index = (index + 1) % numParticipants;
  }

  return contributions.map(contribution => contribution / MULTIPLIER);
}

export function removeDuplicateParticipants(
  participants: RegisteredParticipants | undefined,
  creatorDetails?: DefinedRegisteredParticipant,
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
  creatorDetails?: DefinedRegisteredParticipant,
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
    | (
        | {
            name?: string | undefined;
            contribution?: number | undefined;
            phone?: string | undefined;
            uuid?: string | undefined;
            username?: string | undefined;
            profileImageUrl?: string | null | undefined;
            profileImageHash?: string | null | undefined;
          }
        | undefined
      )[]
    | undefined;
  unregisteredParticipants?:
    | (
        | {
            name?: string | undefined;
            contribution?: number | undefined;
            phone?: string | undefined;
            created?: string | undefined;
            modified?: string | undefined;
            uuid?: string | undefined;
          }
        | undefined
      )[]
    | undefined;
}

export function sumTotalParticipantAllocations(
  participants: FormParticipantContributions,
): {
  registered: number;
  unregistered: number;
  total: number;
  allAllocations: number[];
} {
  let registeredSum = 0;
  let unregisteredSum = 0;

  const allAllocations: number[] = [];

  participants.registeredParticipants?.forEach((participant, index) => {
    if (participant) {
      registeredSum += Number(participant[`registeredContribution${index}`]);
      allAllocations.push(Number(participant[`registeredContribution${index}`]));
    }
  });

  participants.unregisteredParticipants?.forEach((participant, index) => {
    if (participant) {
      unregisteredSum += Number(participant[`unregisteredContribution${index}`]);
      allAllocations.push(Number(participant[`unregisteredContribution${index}`]));
    }
  });

  return {
    registered: registeredSum,
    unregistered: unregisteredSum,
    total: unregisteredSum + registeredSum,
    allAllocations,
  };
}
