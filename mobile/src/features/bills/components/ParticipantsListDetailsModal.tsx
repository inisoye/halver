import * as React from 'react';

import {
  Box,
  DynamicText,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
} from '@/components';
import { RightCaret } from '@/icons';
import {
  convertKebabAndSnakeToTitleCase,
  convertNumberToNaira,
  isAndroid,
} from '@/utils';

import { BillDetailAction } from '../types';
import { statusColorIndex } from '../utils';

const hitSlop = {
  top: 10,
  right: 40,
  bottom: 10,
  left: 40,
};

interface ParticipantsListDetailsModalProps {
  actions: BillDetailAction[] | undefined;
  selectedAction: BillDetailAction[] | undefined;
  openModal: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
  isDiscreet: boolean | undefined;
}

export const ParticipantsListDetailsModal: React.FunctionComponent<
  ParticipantsListDetailsModalProps
> = ({ actions, openModal, closeModal, isModalOpen, selectedAction, isDiscreet }) => {
  const displayedActions = selectedAction || actions;

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
          paddingBottom={isAndroid() ? '6' : '8'}
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
              Expected contribution
            </Text>
          </Box>

          <ScrollView>
            <Box>
              {displayedActions?.map(
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

                  const name = convertKebabAndSnakeToTitleCase(
                    participant?.fullName || unregisteredParticipant?.name,
                  );

                  return (
                    <Box
                      alignItems="center"
                      borderBottomColor="gray5"
                      borderBottomWidth={1}
                      flexDirection="row"
                      gap="4"
                      justifyContent="space-between"
                      key={uuid}
                      paddingVertical="3.5"
                    >
                      <Box maxWidth="60%">
                        <Text
                          color="textLight"
                          marginBottom="0.5"
                          numberOfLines={1}
                          variant="sm"
                        >
                          {name}
                        </Text>

                        <Text
                          color={actionStatusColor}
                          fontFamily="Halver-Semibold"
                          variant="xs"
                        >
                          {formattedStatus}
                        </Text>
                      </Box>

                      <DynamicText maxWidth="36%" variant="sm">
                        {!!contribution && convertNumberToNaira(Number(contribution))}
                      </DynamicText>
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
