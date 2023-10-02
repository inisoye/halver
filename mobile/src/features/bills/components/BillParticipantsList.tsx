import { useTheme } from '@shopify/restyle';
import * as React from 'react';

import { Box, Image, ScrollView, Text, TouchableOpacity } from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { Theme } from '@/lib/restyle';
import {
  convertKebabAndSnakeToTitleCase,
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  useIsDarkModeSelected,
} from '@/utils';

import { BillDetailAction } from '../types';
import { statusColorIndex } from '../utils';
import { ParticipantsListDetailsModal } from './ParticipantsListDetailsModal';

interface BillParticipantItemProps {
  action: BillDetailAction;
  handleItemSelection: (selectedAction: BillDetailAction) => void;
  isDiscreet: boolean | undefined;
}

const BillParticipantItem: React.FunctionComponent<BillParticipantItemProps> =
  React.memo(({ action, handleItemSelection, isDiscreet }) => {
    const {
      status: actionStatus,
      participant,
      unregisteredParticipant,
      uuid,
    } = action;

    const isDarkMode = useIsDarkModeSelected();

    const formattedStatus = convertKebabAndSnakeToTitleCase(actionStatus);
    const actionStatusColor = actionStatus
      ? statusColorIndex[actionStatus]
      : undefined;
    const initials = getInitials(
      participant?.fullName || unregisteredParticipant?.name,
    );

    const avatarBackground = isDarkMode
      ? getLightColorFromString(
          participant?.fullName || unregisteredParticipant?.name,
        )
      : getDarkColorFromString(
          participant?.fullName || unregisteredParticipant?.name,
        );

    const hasImage = !!participant?.profileImageUrl;

    const selectItem = () => {
      handleItemSelection(action);
    };

    const name = convertKebabAndSnakeToTitleCase(
      participant?.fullName || unregisteredParticipant?.name,
    );

    return (
      <TouchableOpacity
        alignItems="center"
        backgroundColor="elementBackground"
        borderRadius="lg"
        disabled={isDiscreet}
        elevation={0.5}
        flexDirection="row"
        gap="4"
        key={uuid}
        paddingHorizontal="2.5"
        paddingVertical="2"
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
          <Text fontFamily="Halver-Semibold" marginBottom="0.75" variant="xs2">
            {name}
          </Text>
          <Text
            color={actionStatusColor}
            fontFamily="Halver-Semibold"
            variant="xxs"
          >
            {formattedStatus}
          </Text>
        </Box>
      </TouchableOpacity>
    );
  });

interface BillParticipantsListProps {
  actions: BillDetailAction[] | undefined;
  billName: string;
  isDiscreet: boolean | undefined;
}

export const BillParticipantsList: React.FunctionComponent<
  BillParticipantsListProps
> = ({ actions, billName, isDiscreet }) => {
  const { spacing } = useTheme<Theme>();
  const [selectedAction, setSelectedAction] = React.useState<
    BillDetailAction[] | undefined
  >(undefined);

  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

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
          actions={actions}
          billName={billName}
          closeModal={closeModal}
          isDiscreet={isDiscreet}
          isModalOpen={isModalOpen}
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
          {actions?.map(action => {
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
