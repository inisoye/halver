import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import { useMMKVObject } from 'react-native-mmkv';

import { Box, DynamicText, Image, RectButton, Text } from '@/components';
import type {
  BillCreationMMKVPayload,
  RegisteredContactsList,
} from '@/features/new-bill';
import { SelectInactiveItem, SelectTick } from '@/icons';
import { allMMKVKeys } from '@/lib/mmkv';
import { Theme } from '@/lib/restyle';
import { getInitials, useIsDarkMode } from '@/utils';
import { getDarkColorFromString, getLightColorFromString } from '@/utils/colors';

type RegisteredContact = RegisteredContactsList[number];

type DefinedContactItem =
  | RegisteredContact
  | {
      fullName: string;
      phone: string | false | undefined;
    };

type ContactItem = DefinedContactItem | undefined;

interface ContactOptionProps {
  avatarBackground: string | undefined;
  contactHasImage: boolean;
  handleItemClick: (clickedItem: DefinedContactItem) => void;
  initials: string | undefined;
  isDarkMode: boolean;
  isRegistered: boolean;
  isSelected: boolean | undefined;
  item: DefinedContactItem;
  isLastItem: boolean;
  selectedColor: string;
  iconMargin: number;
}

const ContactOption: React.FunctionComponent<ContactOptionProps> = ({
  avatarBackground,
  contactHasImage,
  handleItemClick,
  initials,
  isDarkMode,
  isRegistered,
  isSelected,
  item,
  isLastItem,
  selectedColor,
  iconMargin,
}) => {
  return (
    <RectButton
      activeOpacity={0.07}
      marginBottom={isLastItem ? '40' : '0'}
      rippleColor={selectedColor}
      underlayColor="green"
      onPress={() => {
        handleItemClick(item);
      }}
    >
      <Box
        accessibilityRole="button"
        alignItems="center"
        backgroundColor={isSelected ? 'selectedItemBackground' : 'transparent'}
        flex={1}
        flexDirection="row"
        gap="3"
        justifyContent="space-between"
        paddingVertical="4"
        accessible
      >
        <Box
          alignItems="center"
          flexDirection="row"
          gap="3"
          marginLeft="6"
          maxWidth="80%"
          width="100%"
        >
          <Box position="relative">
            {contactHasImage ? (
              <Image
                backgroundColor={false ? 'white' : 'bankImageBackground'}
                borderRadius="lg"
                contentFit="contain"
                height={40}
                placeholder={(item as RegisteredContact).profileImageHash}
                source={(item as RegisteredContact).profileImageUrl}
                width={40}
              />
            ) : (
              <Box
                alignItems="center"
                backgroundColor={false ? 'white' : 'bankImageBackground'}
                borderRadius="lg"
                height={40}
                justifyContent="center"
                style={{ backgroundColor: avatarBackground }}
                width={40}
              >
                <Text
                  color={isDarkMode ? 'textBlack' : 'textWhite'}
                  fontFamily="Halver-Semibold"
                >
                  {initials}
                </Text>
              </Box>
            )}

            {isRegistered && (
              <Box
                backgroundColor="background"
                borderRadius="base"
                left={-13}
                padding="0.75"
                position="absolute"
                top={-10}
              >
                <Box
                  backgroundColor="apricot6"
                  height={5}
                  marginBottom="px"
                  width={14}
                />
                <Box backgroundColor="casal7" height={5} marginLeft="0.75" width={14} />
                <Box
                  backgroundColor="background"
                  height={12}
                  position="absolute"
                  right={9}
                  top={3}
                  width={1}
                />
              </Box>
            )}
          </Box>

          <Box flexShrink={1}>
            <DynamicText flexShrink={1} lineHeight={20} numberOfLines={1}>
              {item?.fullName}
            </DynamicText>
            <DynamicText
              color="textLight"
              flexShrink={1}
              lineHeight={20}
              numberOfLines={1}
              variant="xs"
            >
              {item?.phone}
            </DynamicText>
          </Box>
        </Box>

        {isSelected && <SelectTick style={{ marginRight: iconMargin }} />}
        {!isSelected && <SelectInactiveItem style={{ marginRight: iconMargin }} />}
      </Box>
    </RectButton>
  );
};

export const ContactRenderItem = ({
  item,
  isLastItem,
}: {
  item: ContactItem | string;
  index: number;
  isLastItem: boolean;
}) => {
  const itemIsObject = typeof item === 'object';

  const { spacing, colors } = useTheme<Theme>();
  const isDarkMode = useIsDarkMode();

  const [newBillPayload, setNewBillPayload] = useMMKVObject<BillCreationMMKVPayload>(
    allMMKVKeys.newBillPayload,
  );

  const selectedRegisteredParticipants = newBillPayload?.registeredParticipants;
  const selectedUnregisteredParticipants = newBillPayload?.unregisteredParticipants;

  const initials = React.useMemo(() => {
    if (itemIsObject && item.fullName) {
      return getInitials(item?.fullName);
    }
  }, [item, itemIsObject]);

  const avatarBackground = React.useMemo(() => {
    if (itemIsObject) {
      return isDarkMode
        ? getLightColorFromString(item?.fullName || '')
        : getDarkColorFromString(item?.fullName || '');
    }
  }, [isDarkMode, item, itemIsObject]);

  const contactHasImage =
    itemIsObject && !!item && 'profileImageUrl' in item && !!item?.profileImageUrl;

  const isRegistered = itemIsObject && !!item && 'uuid' in item && !!item?.uuid;

  const isSelectedAsRegistered = React.useMemo(() => {
    if (itemIsObject && isRegistered) {
      return selectedRegisteredParticipants?.some(user => user.uuid === item?.uuid);
    }
  }, [isRegistered, item, itemIsObject, selectedRegisteredParticipants]);

  const isSelectedAsUnregistered = React.useMemo(() => {
    if (itemIsObject) {
      return selectedUnregisteredParticipants?.some(user => user.phone === item?.phone);
    }
  }, [item, itemIsObject, selectedUnregisteredParticipants]);

  const isSelected = isSelectedAsRegistered || isSelectedAsUnregistered;

  const handleRegisteredUserClick = (clickedItem: DefinedContactItem) => {
    if (
      !newBillPayload ||
      !selectedRegisteredParticipants ||
      !clickedItem ||
      !('uuid' in clickedItem)
    ) {
      return;
    }

    const {
      uuid: selectedParticipantUUID,
      fullName: selectedParticipantName,
      username: selectedParticipantUsername,
      profileImageHash: selectedParticipantProfileImageHash,
      profileImageUrl: selectedParticipantProfileImageUrl,
      phone: selectedParticipantPhone,
    } = clickedItem;

    if (isSelectedAsRegistered) {
      setNewBillPayload({
        ...newBillPayload,
        registeredParticipants: selectedRegisteredParticipants.filter(
          mmkvItem => mmkvItem.uuid !== selectedParticipantUUID,
        ),
      });
    } else {
      setNewBillPayload({
        ...newBillPayload,
        registeredParticipants: [
          ...selectedRegisteredParticipants,
          {
            name: selectedParticipantName,
            contribution: 0,
            username: selectedParticipantUsername,
            uuid: selectedParticipantUUID,
            profileImageHash: selectedParticipantProfileImageHash,
            profileImageUrl: selectedParticipantProfileImageUrl,
            phone: selectedParticipantPhone || '',
          },
        ],
      });
    }
  };

  const handleUnregisteredUserClick = (clickedItem: DefinedContactItem) => {
    if (!newBillPayload || !selectedUnregisteredParticipants || !clickedItem) {
      return;
    }

    if (isSelectedAsUnregistered) {
      setNewBillPayload({
        ...newBillPayload,
        unregisteredParticipants: selectedUnregisteredParticipants.filter(
          mmkvItem => mmkvItem.phone !== clickedItem.phone,
        ),
      });
      return;
    } else {
      setNewBillPayload({
        ...newBillPayload,
        unregisteredParticipants: [
          ...selectedUnregisteredParticipants,
          {
            name: clickedItem.fullName,
            phone: clickedItem.phone || '',
            contribution: 0,
          },
        ],
      });
    }
  };

  const handleItemClick = (clickedItem: DefinedContactItem) => {
    if (isRegistered) {
      handleRegisteredUserClick(clickedItem);
    } else {
      handleUnregisteredUserClick(clickedItem);
    }
  };

  if (typeof item === 'undefined') {
    return <></>;
  }

  if (typeof item === 'string') {
    return (
      <Text
        fontFamily="Halver-Semibold"
        marginBottom="2"
        marginTop="8"
        paddingHorizontal="6"
        variant="xl"
      >
        {item}
      </Text>
    );
  }

  return (
    <ContactOption
      avatarBackground={avatarBackground}
      contactHasImage={contactHasImage}
      handleItemClick={handleItemClick}
      iconMargin={spacing[6]}
      initials={initials}
      isDarkMode={isDarkMode}
      isLastItem={isLastItem}
      isRegistered={isRegistered}
      isSelected={isSelected}
      item={item}
      selectedColor={colors.selectedItemBackground}
    />
  );
};
