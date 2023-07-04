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

import {
  FormattedRegisteredParticipant,
  FormattedUnregisteredParticipant,
} from '../types';

interface AmountSplitParticipantItemProps {
  control: Control<{
    registeredParticipants: FormattedRegisteredParticipant[];
    unregisteredParticipants: FormattedUnregisteredParticipant[];
  }>;
  index: number;
  isCreditor?: boolean;
  isRegistered: boolean;
  name: string;
  profileImageHash?: string | null | undefined;
  profileImageUrl?: string | null | undefined;
  subtext: string;
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
  const isDarkMode = useIsDarkMode();

  const initials = React.useMemo(() => getInitials(name), [name]);

  const avatarBackground = React.useMemo(() => {
    return isDarkMode ? getLightColorFromString(name) : getDarkColorFromString(name);
  }, [isDarkMode, name]);

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
        <Box
          alignItems="center"
          flexDirection="row"
          flexGrow={0}
          flexShrink={1}
          gap="3"
        >
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
            <DynamicText fontSize={15} numberOfLines={1}>
              {name}
            </DynamicText>
            <Text color="textLight" variant="xs">
              {subtext}
            </Text>
          </Box>
        </Box>

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
          name={`${
            isRegistered ? 'registeredParticipants' : 'unregisteredParticipants'
          }.${index}.contribution`}
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

interface AmountSplitBreakdownTabProps {
  controlForAmountForm: Control<{
    registeredParticipants: FormattedRegisteredParticipant[];
    unregisteredParticipants: FormattedUnregisteredParticipant[];
  }>;
  creditor: FormattedRegisteredParticipant;
  registeredParticipantAmountFields: FieldArrayWithId<
    {
      registeredParticipants: FormattedRegisteredParticipant[];
      unregisteredParticipants: FormattedUnregisteredParticipant[];
    },
    'registeredParticipants',
    'id'
  >[];
  unregisteredParticipantAmountFields: FieldArrayWithId<
    {
      registeredParticipants: FormattedRegisteredParticipant[];
      unregisteredParticipants: FormattedUnregisteredParticipant[];
    },
    'unregisteredParticipants',
    'id'
  >[];
}

export const AmountSplitBreakdownTab: React.FunctionComponent<
  AmountSplitBreakdownTabProps
> = ({
  controlForAmountForm,
  creditor,
  registeredParticipantAmountFields,
  unregisteredParticipantAmountFields,
}) => {
  return (
    <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
      <Box paddingBottom="40">
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
  );
};
