import Decimal from 'decimal.js';

import {
  DefinedRegisteredParticipant,
  DefinedUnregisteredParticipant,
  RegisteredParticipants,
  UnregisteredParticipants,
} from '../types';

/**
 * Calculates even amounts for each participant based on the bill amount and number of participants.
 * @param billAmount - The total bill amount.
 * @param numberOfParticipants - The number of participants.
 * @returns An array of even contributions for each participant.
 */
/**
 * Calculates even amounts for each participant based on the bill amount and number of participants.
 * @param billAmount - The total bill amount.
 * @param numberOfParticipants - The number of participants.
 * @returns An array of even contributions for each participant.
 */
export function calculateEvenAmounts(
  billAmount: number,
  numberOfParticipants: number,
): number[] {
  const MULTIPLIER = new Decimal(100); // Used to convert amounts from decimal and back.

  const evenContribution = new Decimal(billAmount)
    .times(MULTIPLIER)
    .dividedBy(numberOfParticipants)
    .floor();

  const remainingAmount = new Decimal(billAmount)
    .times(MULTIPLIER)
    .modulo(numberOfParticipants);

  const contributions: Decimal[] = [];

  for (let i = 0; i < numberOfParticipants; i++) {
    contributions.push(evenContribution);
  }

  let remaining = remainingAmount.toNumber();
  let index = 0;

  // Distribute the remaining amount among participants
  while (remaining > 0) {
    contributions[index] = contributions[index].plus(1);

    remaining--;

    // Move to the next participant using modulo operator
    index = (index + 1) % numberOfParticipants;
  }

  return contributions.map(contribution =>
    contribution.dividedBy(MULTIPLIER).toNumber(),
  );
}

export function removeDuplicateParticipants(
  participants: RegisteredParticipants | undefined,
  creatorDetails?: DefinedRegisteredParticipant,
) {
  if (!participants) return [];

  const uniqueParticipantsSet = new Set<string | undefined>();
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

  const uniqueParticipantsSet = new Set<string | undefined>();
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
  creditorId: string | undefined,
): {
  registered: number;
  unregistered: number;
  total: number;
  allAllocations: number[];
  allAllocationsExcludingCreditor: number[];
} {
  let registeredSum = 0;
  let unregisteredSum = 0;

  const allAllocations: number[] = [];
  const allAllocationsExcludingCreditor: number[] = [];

  participants.registeredParticipants?.forEach((participant, index) => {
    if (participant) {
      registeredSum += Number(participant[`registeredContribution${index}`]);
      allAllocations.push(Number(participant[`registeredContribution${index}`]));

      if (participant.uuid !== creditorId) {
        allAllocationsExcludingCreditor.push(
          Number(participant[`registeredContribution${index}`]),
        );
      }
    }
  });

  participants.unregisteredParticipants?.forEach((participant, index) => {
    if (participant) {
      unregisteredSum += Number(participant[`unregisteredContribution${index}`]);
      allAllocations.push(Number(participant[`unregisteredContribution${index}`]));
      allAllocationsExcludingCreditor.push(
        Number(participant[`unregisteredContribution${index}`]),
      );
    }
  });

  return {
    registered: registeredSum,
    unregistered: unregisteredSum,
    total: unregisteredSum + registeredSum,
    allAllocations,
    allAllocationsExcludingCreditor,
  };
}
