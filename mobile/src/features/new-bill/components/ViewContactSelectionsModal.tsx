import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import { FadeInDown } from 'react-native-reanimated';

import {
  AnimatedBox,
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
import { SmallClose } from '@/icons';
import { AppRootStackParamList } from '@/navigation';
import {
  getDarkColorWithBackgroundFromString,
  getInitials,
  getLightColorWithBackgroundFromString,
  useIsDarkMode,
} from '@/utils';

import { useBillPayloadWithSelectionDetails } from '../hooks';

interface SelectionAvatarAndNameProps {
  avatarBackground: {
    color: string;
    backgroundColor: string;
  };
  profileImageHash?: string | null;
  profileImageUrl?: string | null;
  name: string | undefined;
}

const areSelectionAvatarAndNamePropsEqual = (
  prevProps: SelectionAvatarAndNameProps,
  nextProps: SelectionAvatarAndNameProps,
) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.profileImageHash === nextProps.profileImageHash &&
    prevProps.profileImageUrl === nextProps.profileImageUrl &&
    prevProps.avatarBackground.color === nextProps.avatarBackground.color &&
    prevProps.avatarBackground.backgroundColor ===
      nextProps.avatarBackground.backgroundColor
  );
};

const SelectionAvatarAndName: React.FunctionComponent<SelectionAvatarAndNameProps> =
  React.memo(({ avatarBackground, name, profileImageHash, profileImageUrl }) => {
    const initials = React.useMemo(() => getInitials(name), [name]);

    const contactHasImage = profileImageHash || profileImageUrl;

    return (
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
            <Text color="textInverse" fontFamily="Halver-Semibold" opacity={0.85}>
              {initials[0]}
            </Text>
          </Box>
        )}

        <DynamicText flexShrink={1} lineHeight={20} maxWidth="80%" numberOfLines={1}>
          {name}
        </DynamicText>
      </Box>
    );
  }, areSelectionAvatarAndNamePropsEqual);

interface SelectionItemProps {
  name: string | undefined;
  index: number;
  profileImageHash?: string | null | undefined;
  profileImageUrl?: string | null | undefined;
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

  const avatarBackground = React.useMemo(
    () =>
      isDarkMode
        ? getLightColorWithBackgroundFromString(name || '')
        : getDarkColorWithBackgroundFromString(name || ''),
    [isDarkMode, name],
  );

  const handlePress = () => {
    handleSelectionRemoval(isRegistered, uuid, phone);
  };

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
    >
      <SelectionAvatarAndName
        avatarBackground={avatarBackground}
        name={name}
        profileImageHash={profileImageHash}
        profileImageUrl={profileImageUrl}
      />

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
  const {
    newBillPayload,
    numberOfSelectionsExcludingCreator,
    pluralExcludingCreatorDenoter,
    selectedRegisteredParticipantsExcludingCreator,
    selectedRegisteredParticipantsExcludingCreatorLength,
    selectedUnregisteredParticipants,
    setNewBillPayload,
  } = useBillPayloadWithSelectionDetails();

  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  React.useEffect(() => {
    // Delay closing by a tiny amount to ensure (removal) calculations are completed first.
    const timeout = setTimeout(() => {
      if (
        !numberOfSelectionsExcludingCreator ||
        (numberOfSelectionsExcludingCreator && numberOfSelectionsExcludingCreator === 0)
      ) {
        closeModal();
      }
    }, 10);

    return () => clearTimeout(timeout);
  }, [closeModal, numberOfSelectionsExcludingCreator]);

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
        registeredParticipants: selectedRegisteredParticipantsExcludingCreator?.filter(
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
      {!!numberOfSelectionsExcludingCreator && (
        <Button
          backgroundColor="inputNestedButtonBackground"
          variant="xs"
          onPress={openModal}
        >
          <Text fontFamily="Halver-Semibold" variant="xs">
            View
            {numberOfSelectionsExcludingCreator
              ? ` ${numberOfSelectionsExcludingCreator}`
              : undefined}{' '}
            selection
            {pluralExcludingCreatorDenoter}
          </Text>
        </Button>
      )}

      <Modal
        closeModal={closeModal}
        headingText={`Your ${numberOfSelectionsExcludingCreator} selection${pluralExcludingCreatorDenoter}`}
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="gray1"
          gap="6"
          maxHeight="91%"
          paddingBottom="8"
          paddingHorizontal="6"
          paddingTop="6"
        >
          <ScrollView>
            <Box gap="4">
              {selectedRegisteredParticipantsExcludingCreator?.map(
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
                    index={
                      selectedRegisteredParticipantsExcludingCreatorLength + index - 1
                    }
                    isRegistered={false}
                    key={phone}
                    name={name}
                    phone={phone}
                  />
                );
              })}
            </Box>
          </ScrollView>

          {numberOfSelectionsExcludingCreator > 1 && (
            <Button
              alignSelf="flex-end"
              backgroundColor="inputNestedButtonBackground"
              variant="xs"
              onPress={handleRemoveAll}
            >
              <Text fontFamily="Halver-Semibold" variant="xs">
                Clear all
              </Text>
            </Button>
          )}

          <Button
            backgroundColor="buttonApricot"
            disabled={numberOfSelectionsExcludingCreator < 1}
            marginTop="2"
            onPress={handleContinue}
          >
            <Text color="buttonTextApricot" fontFamily="Halver-Semibold">
              Continue
              {numberOfSelectionsExcludingCreator >= 1 &&
                ` with ${numberOfSelectionsExcludingCreator} selection`}
              {pluralExcludingCreatorDenoter}
            </Text>
          </Button>
        </Box>
      </Modal>
    </>
  );
};
