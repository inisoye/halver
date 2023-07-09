import * as React from 'react';
import { Control, FieldArrayWithId } from 'react-hook-form';

import { Box, DynamicText, Image, ScrollView, Text, TextField } from '@/components';
import {
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  isIOS,
  useIsDarkMode,
} from '@/utils';

import { DefinedRegisteredParticipant, DefinedUnregisteredParticipant } from '../types';

interface ParticipantAvatarAndNameProps {
  isCreditor?: boolean;
  name: string | undefined;
  profileImageHash?: string | null | undefined;
  profileImageUrl?: string | null | undefined;
  subtext: string | undefined;
}

const ParticipantAvatarAndName: React.FunctionComponent<ParticipantAvatarAndNameProps> =
  React.memo(({ isCreditor, name, profileImageHash, profileImageUrl, subtext }) => {
    const isDarkMode = useIsDarkMode();

    const initials = React.useMemo(() => getInitials(name), [name]);

    const avatarBackground = React.useMemo(() => {
      return isDarkMode ? getLightColorFromString(name) : getDarkColorFromString(name);
    }, [isDarkMode, name]);

    return (
      <Box alignItems="center" flexDirection="row" flexGrow={0} flexShrink={1} gap="3">
        {profileImageUrl ? (
          <Image
            borderRadius="lg"
            contentFit="contain"
            height={36}
            placeholder={profileImageHash}
            source={profileImageUrl}
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
            <Text color="textInverse" fontFamily="Halver-Semibold" variant="sm">
              {initials}
            </Text>
          </Box>
        )}

        <Box gap="1" width="65%">
          <Box flexDirection="row" justifyContent="flex-start">
            <DynamicText
              fontSize={15}
              maxWidth={isCreditor ? '70%' : undefined}
              numberOfLines={1}
            >
              {name}
            </DynamicText>
            {isCreditor && (
              <Text color="green11" fontSize={15} numberOfLines={1}>
                {' '}
                - Creditor
              </Text>
            )}
          </Box>
          <Text color="textLight" variant="xs">
            {subtext}
          </Text>
        </Box>
      </Box>
    );
  });

interface AmountSplitParticipantItemProps {
  control: Control<{
    registeredParticipants: DefinedRegisteredParticipant[];
    unregisteredParticipants: DefinedUnregisteredParticipant[];
  }>;
  index: number;
  isCreditor?: boolean;
  isRegistered: boolean;
  name: string | undefined;
  profileImageHash?: string | null | undefined;
  profileImageUrl?: string | null | undefined;
  subtext: string | undefined;
}

export const AmountSplitParticipantItem: React.FunctionComponent<
  AmountSplitParticipantItemProps
> = ({
  control,
  index,
  isCreditor,
  isRegistered,
  name,
  profileImageHash,
  profileImageUrl,
  subtext,
}) => {
  return (
    <>
      <Box
        alignItems="center"
        backgroundColor={isCreditor ? 'selectedItemBackground' : 'transparent'}
        flexDirection="row"
        gap="2"
        justifyContent="space-between"
        paddingHorizontal="6"
        paddingVertical="3.5"
      >
        <ParticipantAvatarAndName
          isCreditor={isCreditor}
          name={name}
          profileImageHash={profileImageHash}
          profileImageUrl={profileImageUrl}
          subtext={subtext}
        />

        <TextField
          alignSelf="flex-end"
          backgroundColor="transparent"
          borderBottomColor="gray9"
          borderBottomWidth={1}
          borderRadius="none"
          containerProps={{ maxWidth: '35%' }}
          control={control}
          flex={-1}
          fontSize={14}
          keyboardType="number-pad"
          minWidth={30}
          name={`${isRegistered ? '' : 'un'}registeredParticipants.${index}.${
            isRegistered ? '' : 'un'
          }registeredContribution${index}`}
          paddingHorizontal="0"
          paddingVertical={isIOS() ? '1' : '0'}
          prefixComponent={<Text variant="sm">₦</Text>}
          prefixContainerProps={{
            backgroundColor: 'transparent',
            paddingVertical: '0',
            paddingHorizontal: '0',
          }}
          textAlign="right"
        />
      </Box>
    </>
  );
};

interface AmountSplitBreakdownItemsProps {
  controlForAmountForm: Control<{
    registeredParticipants: DefinedRegisteredParticipant[];
    unregisteredParticipants: DefinedUnregisteredParticipant[];
  }>;
  creditor: DefinedRegisteredParticipant;
  registeredParticipantAmountFields: FieldArrayWithId<
    {
      registeredParticipants: DefinedRegisteredParticipant[];
      unregisteredParticipants: DefinedUnregisteredParticipant[];
    },
    'registeredParticipants',
    'id'
  >[];
  unregisteredParticipantAmountFields: FieldArrayWithId<
    {
      registeredParticipants: DefinedRegisteredParticipant[];
      unregisteredParticipants: DefinedUnregisteredParticipant[];
    },
    'unregisteredParticipants',
    'id'
  >[];
}

export const AmountSplitBreakdownItems: React.FunctionComponent<
  AmountSplitBreakdownItemsProps
> = ({
  controlForAmountForm,
  creditor,
  registeredParticipantAmountFields,
  unregisteredParticipantAmountFields,
}) => {
  return (
    <>
      <ScrollView>
        <Box paddingBottom="20">
          {registeredParticipantAmountFields?.map(
            ({ name, uuid, username, profileImageHash, profileImageUrl }, index) => {
              return (
                <AmountSplitParticipantItem
                  control={controlForAmountForm}
                  index={index}
                  isCreditor={uuid === creditor.uuid}
                  key={uuid}
                  name={name}
                  profileImageHash={profileImageHash}
                  profileImageUrl={profileImageUrl}
                  subtext={`@${username}`}
                  isRegistered
                />
              );
            },
          )}

          {unregisteredParticipantAmountFields?.map(({ name, phone }, index) => {
            return (
              <AmountSplitParticipantItem
                control={controlForAmountForm}
                index={index}
                isRegistered={false}
                key={phone}
                name={name}
                subtext={phone}
              />
            );
          })}
        </Box>
      </ScrollView>
    </>
  );
};
