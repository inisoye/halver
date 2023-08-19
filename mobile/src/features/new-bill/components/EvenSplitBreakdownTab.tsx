import * as React from 'react';

import { Box, DynamicText, Image, ScrollView, Text } from '@/components';
import {
  convertNumberToNaira,
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  useIsDarkModeSelected,
} from '@/utils';

import {
  FormattedRegisteredParticipant,
  FormattedUnregisteredParticipant,
} from '../types';

interface EvenSplitParticipantItemProps {
  name: string | undefined;
  subtext: string | undefined;
  contribution: string;
  profileImageHash?: string | null | undefined;
  profileImageUrl?: string | null | undefined;
  isCreditor?: boolean;
}

const EvenSplitParticipantItem: React.FunctionComponent<
  EvenSplitParticipantItemProps
> = ({
  isCreditor,
  name,
  subtext,
  contribution,
  profileImageHash,
  profileImageUrl,
}) => {
  const isDarkMode = useIsDarkModeSelected();

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
              height={38}
              placeholder={profileImageHash}
              source={profileImageUrl}
              width={38}
            />
          ) : (
            <Box
              alignItems="center"
              borderRadius="lg"
              height={38}
              justifyContent="center"
              style={{ backgroundColor: avatarBackground }}
              width={38}
            >
              <Text color="textInverse" fontFamily="Halver-Semibold">
                {initials}
              </Text>
            </Box>
          )}

          <Box gap="1" width="70%">
            <DynamicText numberOfLines={1}>{name}</DynamicText>
            <Text color="textLight" variant="xs">
              {subtext}
            </Text>
          </Box>
        </Box>

        <DynamicText
          color={isCreditor ? 'green11' : undefined}
          flexGrow={1}
          maxWidth="50%"
          textAlign="right"
          variant="sm"
        >
          {isCreditor ? 'Creditor' : convertNumberToNaira(Number(contribution))}
        </DynamicText>
      </Box>
    </>
  );
};

interface EvenSplitBreakdownTabsProps {
  creditor: FormattedRegisteredParticipant;
  formattedParticipants: FormattedRegisteredParticipant[];
  formattedUnregisteredParticipants: FormattedUnregisteredParticipant[];
}

export const EvenSplitBreakdownTabs: React.FunctionComponent<
  EvenSplitBreakdownTabsProps
> = ({ creditor, formattedParticipants, formattedUnregisteredParticipants }) => {
  return (
    <ScrollView>
      <Box paddingBottom="40">
        {formattedParticipants?.map(
          ({
            name,
            uuid,
            username,
            profileImageHash,
            profileImageUrl,
            contribution,
          }) => {
            return (
              <EvenSplitParticipantItem
                contribution={contribution}
                isCreditor={uuid === creditor.uuid}
                key={uuid}
                name={name}
                profileImageHash={profileImageHash}
                profileImageUrl={profileImageUrl}
                subtext={`@${username}`}
              />
            );
          },
        )}

        {formattedUnregisteredParticipants?.map(({ name, phone, contribution }) => {
          return (
            <EvenSplitParticipantItem
              contribution={contribution}
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
