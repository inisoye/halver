import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import { useMMKVObject } from 'react-native-mmkv';

import {
  Box,
  CraftedLogoSmallest,
  DynamicText,
  Image,
  RectButton,
  Text,
} from '@/components';
import type {
  BillCreationMMKVPayload,
  RegisteredContactsList,
} from '@/features/new-bill';
import { SelectInactiveItem, SelectTick } from '@/icons';
import { allMMKVKeys } from '@/lib/mmkv';
import { Theme } from '@/lib/restyle';
import {
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  useIsDarkModeSelected,
} from '@/utils';

export type RegisteredContact = RegisteredContactsList[number];

export type DefinedContactItem =
  | RegisteredContact
  | {
      fullName: string;
      phone: string | false | undefined;
    };

type ContactItem = DefinedContactItem | undefined;

interface ContactAvatarAndNameProps {
  avatarBackground: string | undefined;
  contactHasImage: boolean;
  initials: string | undefined;
  isRegistered: boolean;
  item: DefinedContactItem;
}

const ContactAvatarAndName: React.FunctionComponent<ContactAvatarAndNameProps> =
  React.memo(
    ({ avatarBackground, contactHasImage, initials, isRegistered, item }) => {
      return (
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
                borderRadius="lg"
                contentFit="contain"
                height={36}
                placeholder={(item as RegisteredContact).profileImageHash}
                source={(item as RegisteredContact).profileImageUrl}
                width={36}
              />
            ) : (
              <Box
                alignItems="center"
                borderRadius="lg"
                height={36}
                justifyContent="center"
                style={{ backgroundColor: avatarBackground }}
                width={36}
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

            {isRegistered && (
              <Box
                backgroundColor="background"
                borderRadius="base"
                left={-13}
                padding="0.75"
                paddingLeft="0"
                position="absolute"
                top={-10}
              >
                <CraftedLogoSmallest />
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
              {isRegistered
                ? `@${(item as RegisteredContact).username}`
                : item?.phone}
            </DynamicText>
          </Box>
        </Box>
      );
    },
  );

interface ContactOptionProps {
  avatarBackground: string | undefined;
  contactHasImage: boolean;
  handleItemClick: (clickedItem: DefinedContactItem) => void;
  initials: string | undefined;
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
  isRegistered,
  isSelected,
  item,
  isLastItem,
  selectedColor,
  iconMargin,
}) => {
  const handlePress = () => {
    handleItemClick(item);
  };

  return (
    <RectButton
      activeOpacity={0.07}
      marginBottom={isLastItem ? '40' : '0'}
      rippleColor={selectedColor}
      underlayColor="green"
      onPress={handlePress}
    >
      <Box
        accessibilityRole="button"
        alignItems="center"
        backgroundColor={isSelected ? 'selectedItemBackground' : 'transparent'}
        flex={1}
        flexDirection="row"
        gap="3"
        justifyContent="space-between"
        paddingVertical="3.5"
        accessible
      >
        <ContactAvatarAndName
          avatarBackground={avatarBackground}
          contactHasImage={contactHasImage}
          initials={initials}
          isRegistered={isRegistered}
          item={item}
        />

        {isSelected && (
          <SelectTick
            height={18}
            style={{ marginRight: iconMargin }}
            width={18}
          />
        )}
        {!isSelected && (
          <SelectInactiveItem
            height={18}
            style={{ marginRight: iconMargin }}
            width={18}
          />
        )}
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
  const isDarkMode = useIsDarkModeSelected();

  const [newBillPayload, setNewBillPayload] =
    useMMKVObject<BillCreationMMKVPayload>(allMMKVKeys.newBillPayload);

  const selectedRegisteredParticipants = newBillPayload?.registeredParticipants;
  const selectedUnregisteredParticipants =
    newBillPayload?.unregisteredParticipants;

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
    itemIsObject &&
    !!item &&
    'profileImageUrl' in item &&
    !!item?.profileImageUrl;

  const isRegistered = itemIsObject && !!item && 'uuid' in item && !!item?.uuid;

  const isSelectedAsRegistered = React.useMemo(() => {
    if (itemIsObject && isRegistered) {
      return selectedRegisteredParticipants?.some(
        user => user.uuid === item?.uuid,
      );
    }
  }, [isRegistered, item, itemIsObject, selectedRegisteredParticipants]);

  const isSelectedAsUnregistered = React.useMemo(() => {
    if (itemIsObject) {
      return selectedUnregisteredParticipants?.some(
        user => user.phone === item?.phone,
      );
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
      uuid: clickedParticipantUUID,
      fullName: clickedParticipantName,
      username: clickedParticipantUsername,
      profileImageHash: clickedParticipantProfileImageHash,
      profileImageUrl: clickedParticipantProfileImageUrl,
      phone: clickedParticipantPhone,
    } = clickedItem;

    if (isSelectedAsRegistered) {
      setNewBillPayload({
        ...newBillPayload,
        registeredParticipants: selectedRegisteredParticipants.filter(
          mmkvItem => mmkvItem.uuid !== clickedParticipantUUID,
        ),
      });
    } else {
      setNewBillPayload({
        ...newBillPayload,
        registeredParticipants: [
          ...selectedRegisteredParticipants,
          {
            name: clickedParticipantName,
            contribution: 0,
            username: clickedParticipantUsername,
            uuid: clickedParticipantUUID,
            profileImageHash: clickedParticipantProfileImageHash,
            profileImageUrl: clickedParticipantProfileImageUrl,
            phone: clickedParticipantPhone || '',
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
      <Box
        backgroundColor="background"
        marginTop="6"
        paddingHorizontal="6"
        paddingVertical="2"
        alignSelf="flex-start"
        maxWidth="80%"
        width="100%"
      >
        <DynamicText fontFamily="Halver-Semibold" variant="xl">
          {item}
        </DynamicText>
      </Box>
    );
  }

  return (
    <ContactOption
      avatarBackground={avatarBackground}
      contactHasImage={contactHasImage}
      handleItemClick={handleItemClick}
      iconMargin={spacing[6]}
      initials={initials}
      isLastItem={isLastItem}
      isRegistered={isRegistered}
      isSelected={isSelected}
      item={item}
      selectedColor={colors.selectedItemBackground}
    />
  );
};
