import * as SMS from 'expo-sms';
import * as React from 'react';
import { Share } from 'react-native';

import {
  Box,
  Button,
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

interface SMSButtonProps {
  billName: string;
  participantName: string;
  selectedAction: BillDetailAction[] | undefined;
  unregisteredPhoneNumbersList: string[];
}

const SMSButton: React.FunctionComponent<SMSButtonProps> = ({
  billName,
  participantName,
  selectedAction,
  unregisteredPhoneNumbersList,
}) => {
  const [isSMSAvailable, setIsSMSAvailable] = React.useState(false);

  const handleComposeMessage = React.useCallback(async () => {
    if (isSMSAvailable) {
      await SMS.sendSMSAsync(
        unregisteredPhoneNumbersList,
        `Hi${
          selectedAction ? ' ' + participantName : ''
        }! You have been invited to join a bill (${billName}) on Halver. Go to https://www.halverapp.com/ to join Halver and make your contribution. Make sure you use this phone number to register. Thanks!`,
      );
    }
  }, [
    isSMSAvailable,
    unregisteredPhoneNumbersList,
    selectedAction,
    participantName,
    billName,
  ]);

  React.useEffect(() => {
    SMS.isAvailableAsync().then(setIsSMSAvailable);
  }, []);

  return (
    <Button
      backgroundColor="buttonNeutralDarker"
      disabled={false}
      flex={1}
      onPress={handleComposeMessage}
    >
      <Text color="buttonTextNeutral" fontFamily="Halver-Semibold">
        SMS
      </Text>
    </Button>
  );
};

interface ShareButtonProps {
  billName: string;
  participantName: string;
  selectedAction: BillDetailAction[] | undefined;
  unregisteredPhoneNumbersList: string[];
}

const ShareButton: React.FunctionComponent<ShareButtonProps> = ({
  billName,
  participantName,
  selectedAction,
  unregisteredPhoneNumbersList,
}) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hi${
          selectedAction ? ' ' + participantName : ''
        }! You have been invited to join a bill (${billName}) on Halver. Go to https://www.halverapp.com/ to join Halver and make your contribution.${
          selectedAction
            ? ` Make sure you register with this phone number: ${unregisteredPhoneNumbersList?.[0]}.`
            : ''
        } Thanks!`,
      });
    } catch (error) {}
  };

  return (
    <Button
      backgroundColor="buttonCasal"
      disabled={false}
      flex={1}
      onPress={handleShare}
    >
      <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
        Share
      </Text>
    </Button>
  );
};

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
  billName: string;
}

export const ParticipantsListDetailsModal: React.FunctionComponent<
  ParticipantsListDetailsModalProps
> = ({
  actions,
  openModal,
  closeModal,
  isModalOpen,
  selectedAction,
  isDiscreet,
  billName,
}) => {
  const displayedActions = selectedAction || actions;

  const participantName = selectedAction
    ? selectedAction?.[0]?.participant?.fullName ||
      selectedAction?.[0]?.unregisteredParticipant?.name
    : 'All participants';

  const areAnyParticipantsUnregistered = actions?.some(
    action => action.status === 'unregistered',
  );

  const isSelectedParticipantUnregistered =
    selectedAction?.[0]?.status === 'unregistered';

  const areShareButtonsDisplayed =
    (areAnyParticipantsUnregistered && !selectedAction) ||
    isSelectedParticipantUnregistered;

  const unregisteredPhoneNumbersList =
    displayedActions
      ?.filter(action => action.status === 'unregistered')
      ?.map(action => action.unregisteredParticipant.phone) ?? [];

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
        headingText={participantName}
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
            <DynamicText
              color="textLight"
              marginBottom="4"
              maxWidth="85%"
              variant="sm"
            >
              The contributions (excluding fees) for all the participants on
              this bill are provided below.
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

                  const formattedStatus =
                    convertKebabAndSnakeToTitleCase(status);

                  const name = convertKebabAndSnakeToTitleCase(
                    participant?.fullName ?? unregisteredParticipant?.name,
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
                        {!!contribution &&
                          convertNumberToNaira(Number(contribution))}
                      </DynamicText>
                    </Box>
                  );
                },
              )}
            </Box>
          </ScrollView>

          {areShareButtonsDisplayed && (
            <Box marginBottom="2" marginTop="6">
              <DynamicText color="textLight" marginBottom="2" variant="sm">
                Remind{' '}
                {selectedAction
                  ? participantName
                  : 'all unregistered participants'}
              </DynamicText>

              <Box flexDirection="row" gap="3">
                <SMSButton
                  billName={billName}
                  participantName={participantName}
                  selectedAction={selectedAction}
                  unregisteredPhoneNumbersList={unregisteredPhoneNumbersList}
                />

                <ShareButton
                  billName={billName}
                  participantName={participantName}
                  selectedAction={selectedAction}
                  unregisteredPhoneNumbersList={unregisteredPhoneNumbersList}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};
