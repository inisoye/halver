import { useTheme } from '@shopify/restyle';
import * as React from 'react';

import { Box, Image, ScrollView, Text, TouchableOpacity } from '@/components';
import { useUserDetails } from '@/features/account';
import { statusColorIndex } from '@/features/new-bill';
import { useBooleanStateControl } from '@/hooks';
import { Theme } from '@/lib/restyle';
import {
  convertKebabAndSnakeToTitleCase,
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  useIsDarkMode,
} from '@/utils';

import { BillDetailAction } from '../types';
import { ParticipantsListDetailsModal } from './ParticipantsListDetailsModal';

interface BillParticipantItemProps {
  action: BillDetailAction;
  handleItemSelection: (selectedAction: BillDetailAction) => void;
  isDiscreet: boolean | undefined;
}

const BillParticipantItem: React.FunctionComponent<BillParticipantItemProps> =
  React.memo(({ action, handleItemSelection, isDiscreet }) => {
    const { status: actionStatus, participant, unregisteredParticipant, uuid } = action;

    const isDarkMode = useIsDarkMode();

    const formattedStatus = convertKebabAndSnakeToTitleCase(actionStatus);
    const actionStatusColor = actionStatus ? statusColorIndex[actionStatus] : undefined;
    const initials = getInitials(
      participant?.fullName || unregisteredParticipant?.name,
    );

    const avatarBackground = isDarkMode
      ? getLightColorFromString(participant?.fullName || unregisteredParticipant?.name)
      : getDarkColorFromString(participant?.fullName || unregisteredParticipant?.name);

    const hasImage = !!participant?.profileImageUrl;

    const selectItem = () => {
      handleItemSelection(action);
    };

    return (
      <TouchableOpacity
        alignItems="center"
        backgroundColor="elementBackground"
        borderRadius="lg"
        disabled={isDiscreet}
        elevation={1}
        flexDirection="row"
        gap="4"
        key={uuid}
        paddingHorizontal="2.5"
        paddingVertical="2.5"
        shadowColor="black"
        shadowOffset={{
          width: 0.1,
          height: 0.3,
        }}
        shadowOpacity={0.2}
        shadowRadius={0.3}
        onPress={selectItem}
      >
        {hasImage ? (
          <Image
            borderRadius="lg"
            contentFit="contain"
            height={32}
            placeholder={participant?.profileImageHash}
            source={participant?.profileImageUrl}
            width={32}
          />
        ) : (
          <Box
            alignItems="center"
            borderRadius="lg"
            height={32}
            justifyContent="center"
            style={{ backgroundColor: avatarBackground }}
            width={32}
          >
            <Text
              color="textInverse"
              fontFamily="Halver-Semibold"
              opacity={0.85}
              variant="sm"
            >
              {initials}
            </Text>
          </Box>
        )}

        <Box>
          <Text fontFamily="Halver-Semibold" marginBottom="0.75" variant="xs">
            {participant?.fullName || unregisteredParticipant?.name}
          </Text>
          <Text color={actionStatusColor} fontFamily="Halver-Semibold" variant="xxs">
            {formattedStatus}
          </Text>
        </Box>
      </TouchableOpacity>
    );
  });

interface BillParticipantsListProps {
  actions: BillDetailAction[] | undefined;
  isDiscreet: boolean | undefined;
}

export const BillParticipantsList: React.FunctionComponent<
  BillParticipantsListProps
> = ({ actions, isDiscreet }) => {
  const { spacing } = useTheme<Theme>();
  const { data: userDetails } = useUserDetails();
  const [selectedAction, setSelectedAction] = React.useState<
    BillDetailAction[] | undefined
  >(undefined);

  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  let modifiedActions = actions || [];

  const currentUserIndex = modifiedActions.findIndex(
    ({ participant }) => userDetails?.uuid === participant?.uuid,
  );

  if (currentUserIndex > 0) {
    const currentUserAction = modifiedActions.splice(currentUserIndex, 1)[0];

    modifiedActions = [
      {
        ...currentUserAction,
        participant: {
          ...currentUserAction.participant,
          fullName: `You (${currentUserAction.participant?.firstName})`,
        },
      },
      ...modifiedActions,
    ];
  }

  const handleOpenAllItems = () => {
    setSelectedAction(undefined);
    openModal();
  };

  const handleItemSelection = (clickedAction: BillDetailAction) => {
    setSelectedAction([clickedAction]);
    openModal();
  };

  return (
    <>
      <Box>
        <ParticipantsListDetailsModal
          closeModal={closeModal}
          isDiscreet={isDiscreet}
          isModalOpen={isModalOpen}
          modifiedActions={modifiedActions}
          openModal={handleOpenAllItems}
          selectedAction={selectedAction}
        />

        <ScrollView
          contentContainerStyle={{
            gap: spacing[3],
            paddingVertical: spacing[0.5],
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {modifiedActions?.map(action => {
            return (
              <BillParticipantItem
                action={action}
                handleItemSelection={handleItemSelection}
                isDiscreet={isDiscreet}
                key={action.uuid}
              />
            );
          })}
        </ScrollView>
      </Box>
    </>
  );
};
