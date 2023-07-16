import * as React from 'react';

import {
  Box,
  DynamicText,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
} from '@/components';
import { statusColorIndex } from '@/features/new-bill';
import { RightCaret } from '@/icons';
import { convertKebabAndSnakeToTitleCase, convertNumberToNaira } from '@/utils';

import { BillDetailAction } from '../types';

const hitSlop = {
  top: 10,
  right: 40,
  bottom: 10,
  left: 40,
};

interface ParticipantsListDetailsModalProps {
  modifiedActions: BillDetailAction[];
  selectedAction: BillDetailAction[] | undefined;
  openModal: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
  isDiscreet: boolean | undefined;
}

export const ParticipantsListDetailsModal: React.FunctionComponent<
  ParticipantsListDetailsModalProps
> = ({
  modifiedActions,
  openModal,
  closeModal,
  isModalOpen,
  selectedAction,
  isDiscreet,
}) => {
  const displayedActions = selectedAction || modifiedActions;

  const modalHeading = selectedAction
    ? selectedAction?.[0]?.participant?.fullName ||
      selectedAction?.[0]?.unregisteredParticipant?.name
    : 'All participants';

  return (
    <>
      <TouchableOpacity
        alignItems="center"
        disabled={isDiscreet}
        flexDirection="row"
        gap="4"
        hitSlop={hitSlop}
        justifyContent="space-between"
        marginBottom="3"
        onPress={openModal}
      >
        <Text fontFamily="Halver-Semibold" variant="xl">
          Participants
        </Text>

        <RightCaret isDark />
      </TouchableOpacity>

      <Modal
        closeModal={closeModal}
        headingText={modalHeading}
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          maxHeight="81%"
          paddingBottom="8"
          paddingHorizontal="6"
          paddingTop="6"
        >
          {!selectedAction && (
            <DynamicText color="textLight" marginBottom="4" maxWidth="85%" variant="sm">
              The contributions (excluding fees) for all the participants on this bill
              are provided below.
            </DynamicText>
          )}

          <Box
            borderBottomColor="gray5"
            borderBottomWidth={1}
            flexDirection="row"
            gap="4"
            justifyContent="space-between"
            paddingVertical="2"
          >
            <Text color="textLight" fontFamily="Halver-Semibold" variant="xs">
              Participant
            </Text>
            <Text fontFamily="Halver-Semibold" variant="xs">
              Contribution amount
            </Text>
          </Box>

          <ScrollView>
            <Box>
              {displayedActions.map(
                ({
                  uuid,
                  participant,
                  unregisteredParticipant,
                  contribution,
                  status,
                }) => {
                  const actionStatusColor = status
                    ? statusColorIndex[status]
                    : undefined;

                  const formattedStatus = convertKebabAndSnakeToTitleCase(status);

                  return (
                    <Box
                      alignItems="center"
                      borderBottomColor="gray5"
                      borderBottomWidth={1}
                      flexDirection="row"
                      gap="4"
                      justifyContent="space-between"
                      key={uuid}
                      paddingVertical="4"
                    >
                      <Box>
                        <Text color="textLight" marginBottom="0.5" variant="sm">
                          {participant?.fullName || unregisteredParticipant?.name}
                        </Text>

                        <Text
                          color={actionStatusColor}
                          fontFamily="Halver-Semibold"
                          variant="xs"
                        >
                          {formattedStatus}
                        </Text>
                      </Box>

                      <Text variant="sm">
                        {!!contribution && convertNumberToNaira(Number(contribution))}
                      </Text>
                    </Box>
                  );
                },
              )}
            </Box>
          </ScrollView>
        </Box>
      </Modal>
    </>
  );
};
