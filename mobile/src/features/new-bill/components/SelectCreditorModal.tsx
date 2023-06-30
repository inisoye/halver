import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import { FadeIn } from 'react-native-reanimated';

import {
  Box,
  Button,
  DynamicText,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
} from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { Theme } from '@/lib/restyle';
import {
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  useIsDarkMode,
} from '@/utils';

import { FormattedRegisteredParticipant } from '../types';

interface SelectCreditorOptionProps {
  closeModal: () => void;
  participant: FormattedRegisteredParticipant;
  setCreditor: React.Dispatch<React.SetStateAction<FormattedRegisteredParticipant>>;
}

const SelectCreditorOption: React.FunctionComponent<SelectCreditorOptionProps> = ({
  closeModal,
  participant,
  setCreditor,
}) => {
  const { name, profileImageHash, profileImageUrl } = participant;
  const isDarkMode = useIsDarkMode();

  const { avatarBackground, firstName, initials } = React.useMemo(() => {
    return {
      initials: getInitials(name),
      firstName: name.split(' ')[0],
      avatarBackground: isDarkMode
        ? getLightColorFromString(name)
        : getDarkColorFromString(name),
    };
  }, [isDarkMode, name]);

  const handleCreditorSelection = () => {
    setCreditor(participant);
    closeModal();
  };

  return (
    <Pressable onPress={handleCreditorSelection}>
      {profileImageUrl ? (
        <Image
          borderRadius="lg"
          contentFit="contain"
          height={52}
          marginBottom="2"
          placeholder={profileImageHash}
          source={profileImageUrl}
          width={52}
        />
      ) : (
        <Box
          alignItems="center"
          borderRadius="lg"
          height={52}
          justifyContent="center"
          marginBottom="2"
          style={{ backgroundColor: avatarBackground }}
          width={52}
        >
          <Text color="textInverse" fontFamily="Halver-Semibold" variant="lg">
            {initials}
          </Text>
        </Box>
      )}

      <DynamicText maxWidth={52} numberOfLines={1} textAlign="center" variant="xs">
        {firstName}
      </DynamicText>
    </Pressable>
  );
};

interface SelectCreditorModalProps {
  formattedRegisteredParticipants: FormattedRegisteredParticipant[];
  setCreditor: React.Dispatch<React.SetStateAction<FormattedRegisteredParticipant>>;
}

export const SelectCreditorModal: React.FunctionComponent<SelectCreditorModalProps> = ({
  formattedRegisteredParticipants,
  setCreditor,
}) => {
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();
  const { spacing } = useTheme<Theme>();

  return (
    <>
      <Button
        backgroundColor="inputNestedButtonBackground"
        entering={FadeIn}
        hitSlop={16}
        variant="xs"
        onPress={openModal}
      >
        <Text fontFamily="Halver-Semibold" variant="xs">
          Change creditor
        </Text>
      </Button>

      <Modal
        closeModal={closeModal}
        headingText="Who is the creditor?"
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          maxHeight="91%"
          paddingBottom="10"
          paddingHorizontal="6"
          paddingTop="6"
        >
          <DynamicText color="textLight" marginBottom="3" maxWidth="75%" variant="sm">
            Select one registered participant below
          </DynamicText>

          <ScrollView
            contentContainerStyle={{ gap: spacing[6] }}
            flexDirection="row"
            horizontal={true}
          >
            {formattedRegisteredParticipants.map(participant => {
              return (
                <SelectCreditorOption
                  closeModal={closeModal}
                  key={participant.uuid}
                  participant={participant}
                  setCreditor={setCreditor}
                />
              );
            })}
          </ScrollView>
        </Box>
      </Modal>
    </>
  );
};
