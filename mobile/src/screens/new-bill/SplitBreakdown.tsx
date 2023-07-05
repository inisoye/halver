import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, DynamicText, Image, Screen, Text } from '@/components';
import { useUserDetails } from '@/features/account';
import {
  calculateEvenAmounts,
  GradientOverlay,
  removeDuplicateParticipants,
  removeDuplicateUnregisteredParticipants,
  SelectCreditorModal,
  SplitBreakdownForm,
} from '@/features/new-bill';
import { useBillPayloadWithSelectionDetails } from '@/features/new-bill/hooks';
import { AppRootStackParamList } from '@/navigation';
import {
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  useIsDarkMode,
} from '@/utils';

type SplitBreakdownProps = NativeStackScreenProps<
  AppRootStackParamList,
  'Split Breakdown'
>;

export const SplitBreakdown: React.FunctionComponent<SplitBreakdownProps> = () => {
  const { data: creatorDetails } = useUserDetails();
  const isDarkMode = useIsDarkMode();

  const {
    newBillPayload,
    setNewBillPayload,
    selectedRegisteredParticipants,
    selectedUnregisteredParticipants,
  } = useBillPayloadWithSelectionDetails();

  const totalAmountDue = newBillPayload?.totalAmountDue;

  /**
   * Default values are provided below to ensure types are
   * unified with those of selections obtained from MMKV.
   */
  const formattedCreatorDetails = React.useMemo(() => {
    return {
      name: 'You' || '',
      username: creatorDetails?.username || '',
      uuid: creatorDetails?.uuid || '',
      profileImageHash: creatorDetails?.profileImageHash || null,
      profileImageUrl: creatorDetails?.profileImageUrl || null,
      phone: creatorDetails?.phone || '',
      contribution: 0,
    };
  }, [creatorDetails]);

  const [creditor, setCreditor] = React.useState(formattedCreatorDetails);

  const { formattedRegisteredParticipants, formattedUnregisteredParticipants } =
    React.useMemo(() => {
      const uniqueRegisteredParticipants = [
        formattedCreatorDetails,
        ...removeDuplicateParticipants(
          selectedRegisteredParticipants,
          formattedCreatorDetails,
        ),
      ];

      const uniqueUnregisteredParticipants = removeDuplicateUnregisteredParticipants(
        selectedUnregisteredParticipants,
        formattedCreatorDetails,
      );

      const numberOfRegisteredParticipants = uniqueRegisteredParticipants.length;
      const numberOfUnregisteredParticipants = uniqueUnregisteredParticipants.length;
      const numberOfParticipants =
        numberOfRegisteredParticipants + numberOfUnregisteredParticipants;

      const evenAmounts = calculateEvenAmounts(
        Number(totalAmountDue),
        numberOfParticipants,
      );

      const registeredParticipantAmounts = evenAmounts.slice(
        0,
        numberOfRegisteredParticipants,
      );
      const unregisteredParticipantAmounts = evenAmounts.slice(
        numberOfRegisteredParticipants,
        numberOfParticipants + 1,
      );

      const _formattedRegisteredParticipants = uniqueRegisteredParticipants.map(
        (participant, index) => {
          return {
            ...participant,
            /* Additional contribution field named this way to track dirty fields.
             A simple contribution name on every field would make them impossible to track. */
            [`registeredContribution${index}`]: String(
              registeredParticipantAmounts[index],
            ),
          };
        },
      );

      const _formattedUnregisteredParticipants = uniqueUnregisteredParticipants.map(
        (participant, index) => {
          return {
            ...participant,
            [`unregisteredContribution${index}`]: String(
              unregisteredParticipantAmounts[index],
            ),
          };
        },
      );

      return {
        formattedRegisteredParticipants: _formattedRegisteredParticipants,
        formattedUnregisteredParticipants: _formattedUnregisteredParticipants,
      };
    }, [
      formattedCreatorDetails,
      selectedRegisteredParticipants,
      selectedUnregisteredParticipants,
      totalAmountDue,
    ]);

  const {
    creditorInitials,
    isCreatorTheCreditor,
    creditorFirstName,
    creditorAvatarBackground,
  } = React.useMemo(() => {
    return {
      creditorAvatarBackground: isDarkMode
        ? getLightColorFromString(creditor.name)
        : getDarkColorFromString(creditor.name),
      creditorInitials: getInitials(creditor.name),
      isCreatorTheCreditor: creditor.uuid === formattedCreatorDetails.uuid,
      creditorFirstName: creditor.name.split(' ')[0],
    };
  }, [creditor, formattedCreatorDetails, isDarkMode]);

  return (
    <Screen hasNoIOSBottomInset>
      <Box
        alignItems="center"
        backgroundColor="inputBackground"
        flexDirection="row"
        gap="2"
        justifyContent="space-between"
        marginBottom="6"
        marginTop="1.5"
        paddingHorizontal="6"
        paddingVertical="2"
      >
        <Box
          alignItems="center"
          flexDirection="row"
          flexGrow={0}
          flexShrink={1}
          gap="3"
        >
          {creditor.profileImageUrl ? (
            <Image
              borderRadius="base"
              contentFit="contain"
              height={24}
              placeholder={creditor.profileImageHash}
              source={creditor.profileImageUrl}
              width={24}
            />
          ) : (
            <Box
              alignItems="center"
              borderRadius="base"
              height={24}
              justifyContent="center"
              style={{ backgroundColor: creditorAvatarBackground }}
              width={24}
            >
              <Text color="textInverse" fontFamily="Halver-Semibold" variant="xs">
                {creditorInitials}
              </Text>
            </Box>
          )}

          <DynamicText color="textLight" flexShrink={1} numberOfLines={1} variant="sm">
            {`${creditorFirstName} ${isCreatorTheCreditor ? 'are' : 'is'} the creditor`}
          </DynamicText>
        </Box>

        <SelectCreditorModal
          formattedRegisteredParticipants={formattedRegisteredParticipants}
          setCreditor={setCreditor}
        />
      </Box>

      <GradientOverlay />

      <SplitBreakdownForm
        creditor={creditor}
        formattedRegisteredParticipants={formattedRegisteredParticipants}
        formattedUnregisteredParticipants={formattedUnregisteredParticipants}
        newBillPayload={newBillPayload}
        setNewBillPayload={setNewBillPayload}
        totalAmountDue={totalAmountDue}
      />
    </Screen>
  );
};
