import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import { FadeInDown } from 'react-native-reanimated';

import {
  AnimatedBox,
  Box,
  Button,
  DynamicText,
  Image,
  Modal,
  Pressable,
  Text,
} from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { SmallClose } from '@/icons';
import { allMMKVKeys } from '@/lib/mmkv';
import { AppRootStackParamList } from '@/navigation';
import { getInitials, useIsDarkMode } from '@/utils';
import {
  getDarkColorWithBackgroundFromString,
  getLightColorWithBackgroundFromString,
} from '@/utils/colors';

import type { BillCreationMMKVPayload } from '../types';

interface SelectionItemProps {
  name: string;
  index: number;
  profileImageHash?: string | null;
  profileImageUrl?: string | null;
  isRegistered: boolean;
  phone?: string | undefined;
  uuid?: string | undefined;
  handleSelectionRemoval: (
    isRegistered: boolean,
    clickedItemUUID: string | undefined,
    clickedItemPhone: string | undefined,
  ) => void;
}

const SelectionItem: React.FunctionComponent<SelectionItemProps> = ({
  name,
  profileImageHash,
  profileImageUrl,
  isRegistered,
  index,
  phone,
  uuid,
  handleSelectionRemoval,
}) => {
  const isDarkMode = useIsDarkMode();
  const { colors } = useTheme();

  const initials = React.useMemo(() => getInitials(name), [name]);

  const avatarBackground = React.useMemo(
    () =>
      isDarkMode
        ? getLightColorWithBackgroundFromString(name || '')
        : getDarkColorWithBackgroundFromString(name || ''),
    [isDarkMode, name],
  );

  const handlePress = React.useCallback(() => {
    handleSelectionRemoval(isRegistered, uuid, phone);
  }, [handleSelectionRemoval, isRegistered, phone, uuid]);

  const contactHasImage = profileImageHash || profileImageUrl;

  return (
    <AnimatedBox
      alignItems="center"
      backgroundColor="modalElementBackground"
      borderRadius="md"
      columnGap="3"
      entering={FadeInDown.duration(350).delay((index + 1) * 100)}
      flexDirection="row"
      justifyContent="space-between"
      paddingHorizontal="4"
      paddingVertical="2"
      style={{
        backgroundColor: isDarkMode
          ? colors.modalElementBackground
          : avatarBackground.backgroundColor,
      }}
    >
      <Box alignItems="center" columnGap="3" flexDirection="row">
        {contactHasImage ? (
          <Image
            borderRadius="lg"
            contentFit="contain"
            height={28}
            placeholder={profileImageHash}
            source={profileImageUrl}
            width={28}
          />
        ) : (
          <Box
            alignItems="center"
            borderRadius="md"
            height={28}
            justifyContent="center"
            style={{
              backgroundColor: avatarBackground.color,
            }}
            width={28}
          >
            <Text
              color={isDarkMode ? 'textBlack' : 'textWhite'}
              fontFamily="Halver-Semibold"
            >
              {initials[0]}
            </Text>
          </Box>
        )}

        <DynamicText>{name}</DynamicText>
      </Box>

      <Pressable hitSlop={16} onPress={handlePress}>
        <SmallClose />
      </Pressable>
    </AnimatedBox>
  );
};

interface ViewContactSelectionsModalProps {
  navigation: NativeStackNavigationProp<
    AppRootStackParamList,
    'Select Participants',
    undefined
  >;
}

export const ViewContactSelectionsModal: React.FunctionComponent<
  ViewContactSelectionsModalProps
> = ({ navigation }) => {
  const [newBillPayload, setNewBillPayload] = useMMKVObject<BillCreationMMKVPayload>(
    allMMKVKeys.newBillPayload,
  );

  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const selectedRegisteredParticipants = newBillPayload?.registeredParticipants;
  const selectedUnregisteredParticipants = newBillPayload?.unregisteredParticipants;

  const selectedRegisteredParticipantsLength = selectedRegisteredParticipants
    ? selectedRegisteredParticipants.length
    : 0;
  const selectedUnregisteredParticipantsLength = selectedUnregisteredParticipants
    ? selectedUnregisteredParticipants.length
    : 0;

  const numberOfSelections =
    selectedRegisteredParticipants && selectedUnregisteredParticipants
      ? selectedRegisteredParticipantsLength + selectedUnregisteredParticipantsLength
      : 0;

  const pluralDenoter = !!numberOfSelections && numberOfSelections !== 1 ? 's' : '';

  React.useEffect(() => {
    // Delay closing by a tiny amount to ensure (removal) calculations are completed first.
    const timeout = setTimeout(() => {
      if (!numberOfSelections || (numberOfSelections && numberOfSelections === 0)) {
        closeModal();
      }
    }, 0.1);

    return () => clearTimeout(timeout);
  }, [closeModal, numberOfSelections]);

  const handleSelectionRemoval = (
    isRegistered: boolean,
    clickedItemUUID: string | undefined,
    clickedItemPhone: string | undefined,
  ) => {
    if (!newBillPayload) {
      return;
    }

    if (isRegistered) {
      setNewBillPayload({
        ...newBillPayload,
        registeredParticipants: selectedRegisteredParticipants?.filter(
          participant => participant.uuid !== clickedItemUUID,
        ),
      });
    } else {
      setNewBillPayload({
        ...newBillPayload,
        unregisteredParticipants: selectedUnregisteredParticipants?.filter(
          participant => participant.phone !== clickedItemPhone,
        ),
      });
    }
  };

  const handleRemoveAll = () => {
    if (!newBillPayload) {
      return;
    }

    setNewBillPayload({
      ...newBillPayload,
      registeredParticipants: [],
      unregisteredParticipants: [],
    });
  };

  const handleContinue = () => {
    closeModal();
    navigation.navigate('Split Breakdown');
  };

  return (
    <>
      {!!numberOfSelections && (
        <Button
          backgroundColor="inputNestedButtonBackground"
          variant="xs"
          onPress={openModal}
        >
          <Text fontFamily="Halver-Semibold" variant="xs">
            View{numberOfSelections ? ` ${numberOfSelections}` : undefined} selection
            {pluralDenoter}
          </Text>
        </Button>
      )}

      <Modal
        closeModal={closeModal}
        headingText={`Your ${numberOfSelections} selection${pluralDenoter}`}
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="gray1"
          gap="6"
          paddingBottom="8"
          paddingHorizontal="6"
          paddingTop="6"
        >
          <Box gap="4">
            {selectedRegisteredParticipants?.map(
              ({ name, uuid, profileImageHash, profileImageUrl, phone }, index) => {
                return (
                  <SelectionItem
                    handleSelectionRemoval={handleSelectionRemoval}
                    index={index}
                    key={uuid}
                    name={name}
                    phone={phone}
                    profileImageHash={profileImageHash}
                    profileImageUrl={profileImageUrl}
                    uuid={uuid}
                    isRegistered
                  />
                );
              },
            )}

            {selectedUnregisteredParticipants?.map(({ name, phone }, index) => {
              return (
                <SelectionItem
                  handleSelectionRemoval={handleSelectionRemoval}
                  index={selectedRegisteredParticipantsLength + index - 1}
                  isRegistered={false}
                  key={phone}
                  name={name}
                  phone={phone}
                />
              );
            })}

            {numberOfSelections > 1 && (
              <Button
                alignSelf="flex-end"
                backgroundColor="inputNestedButtonBackground"
                entering={FadeInDown.duration(350).delay(
                  (numberOfSelections + 1) * 100,
                )}
                variant="xs"
                onPress={handleRemoveAll}
              >
                <Text fontFamily="Halver-Semibold" variant="xs">
                  Clear all
                </Text>
              </Button>
            )}
          </Box>

          <Button
            backgroundColor="buttonPharlap"
            disabled={numberOfSelections < 1}
            entering={FadeInDown.duration(350).delay((numberOfSelections + 2) * 100)}
            marginTop="2"
            onPress={handleContinue}
          >
            <Text color="buttonTextPharlap" fontFamily="Halver-Semibold">
              Continue
              {numberOfSelections >= 1 && ` with ${numberOfSelections} selection`}
              {pluralDenoter}
            </Text>
          </Button>
        </Box>
      </Modal>
    </>
  );
};
