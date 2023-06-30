import {
  FormattedRegisteredParticipant,
  FormattedUnregisteredParticipant,
  RegisteredParticipants,
  UnregisteredParticipants,
} from '../types';

export function formatParticipantsData(
  participants: RegisteredParticipants | undefined,
  evenAmount: number,
  creatorDetails?: FormattedRegisteredParticipant,
) {
  if (!participants) return [];

  const uniqueParticipantsSet = new Set<string>();
  const uniqueParticipants: FormattedRegisteredParticipant[] = [];

  participants.forEach(participant => {
    if (
      !uniqueParticipantsSet.has(participant.phone) &&
      (participant.phone !== creatorDetails?.phone ||
        participant.uuid !== creatorDetails?.uuid)
    ) {
      uniqueParticipantsSet.add(participant.phone);

      // Formatting logic
      const formattedParticipant = {
        ...participant,
        contribution: String(evenAmount), // Replace with your desired value
      };

      uniqueParticipants.push(formattedParticipant);
    }
  });

  return uniqueParticipants;
}

export function formatUnregisteredParticipantsData(
  participants: UnregisteredParticipants | undefined,
  evenAmount: number,
  creatorDetails?: FormattedUnregisteredParticipant,
) {
  if (!participants) return [];

  const uniqueParticipantsSet = new Set<string>();
  const uniqueParticipants: FormattedUnregisteredParticipant[] = [];

  participants.forEach(participant => {
    if (
      !uniqueParticipantsSet.has(participant.phone) &&
      participant.phone !== creatorDetails?.phone
    ) {
      uniqueParticipantsSet.add(participant.phone);

      // Formatting logic
      const formattedParticipant = {
        ...participant,
        contribution: String(evenAmount), // Replace with your desired value
      };

      uniqueParticipants.push(formattedParticipant);
    }
  });

  return uniqueParticipants;
}
