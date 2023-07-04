import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import {
  AbsoluteKeyboardStickyButton,
  Box,
  DynamicText,
  Image,
  Screen,
  Text,
} from '@/components';
import { useUserDetails } from '@/features/account';
import {
  AllocationVarianceAlert,
  AmountSplitBreakdownTab,
  calculateEvenAmounts,
  GradientOverlay,
  removeDuplicateParticipants,
  removeDuplicateUnregisteredParticipants,
  SelectCreditorModal,
  sumTotalParticipantAllocations,
} from '@/features/new-bill';
import { useBillPayloadWithSelectionDetails } from '@/features/new-bill/hooks';
import { AppRootStackParamList } from '@/navigation';
import {
  convertNumberToNaira,
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  useIsDarkMode,
} from '@/utils';
import { formatNumberWithCommas } from '@/utils/numbers';

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
      contribution: '0',
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
            contribution: String(registeredParticipantAmounts[index]),
          };
        },
      );

      const _formattedUnregisteredParticipants = uniqueUnregisteredParticipants.map(
        (participant, index) => {
          return {
            ...participant,
            contribution: String(unregisteredParticipantAmounts[index]),
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

  const { control: controlForAmountForm } = useForm({
    defaultValues: {
      registeredParticipants: formattedRegisteredParticipants,
      unregisteredParticipants: formattedUnregisteredParticipants,
    },
  });

  const allValues = useWatch({ control: controlForAmountForm });

  const participantAllocationsBreakdown = sumTotalParticipantAllocations(allValues);
  const totalParticipantAllocations = participantAllocationsBreakdown.total;

  const areContributionAllocationsEqual =
    totalParticipantAllocations === Number(totalAmountDue);

  const areContributionAllocationsGreater =
    totalParticipantAllocations > Number(totalAmountDue);

  const areContributionAllocationsLess =
    totalParticipantAllocations < Number(totalAmountDue);

  const excessAmount = areContributionAllocationsGreater
    ? totalParticipantAllocations - Number(totalAmountDue)
    : 0;

  const deficitAmount = areContributionAllocationsLess
    ? Number(totalAmountDue) - totalParticipantAllocations
    : 0;

  const totalAllocationTextColor = areContributionAllocationsEqual
    ? 'green11'
    : areContributionAllocationsLess
    ? 'amber11'
    : areContributionAllocationsGreater
    ? 'tomato11'
    : undefined;

  const { fields: registeredParticipantAmountFields } = useFieldArray({
    control: controlForAmountForm,
    name: 'registeredParticipants',
  });

  const { fields: unregisteredParticipantAmountFields } = useFieldArray({
    control: controlForAmountForm,
    name: 'unregisteredParticipants',
  });

  const updateBillAmount = () => {
    if (!newBillPayload) {
      return;
    }

    setNewBillPayload({
      ...newBillPayload,
      totalAmountDue: String(totalParticipantAllocations),
    });
  };

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

      <Box
        alignItems="center"
        marginBottom="3"
        marginLeft="auto"
        marginRight="auto"
        paddingHorizontal="6"
      >
        <Box flexDirection="row">
          <Text
            color={totalAllocationTextColor}
            fontFamily="Halver-Naira"
            lineHeight={40}
          >
            ₦
          </Text>

          <DynamicText
            color={totalAllocationTextColor}
            flexDirection="row"
            fontFamily="Halver-Semibold"
            textAlign="center"
            variant="4xl"
          >
            {formatNumberWithCommas(Number(totalParticipantAllocations))}
          </DynamicText>
        </Box>

        <DynamicText color="textLight" textAlign="center" variant="sm">
          allocated out of {convertNumberToNaira(Number(totalAmountDue))}.
        </DynamicText>
      </Box>

      {areContributionAllocationsGreater && (
        <AllocationVarianceAlert
          totalAllocationTextColor={totalAllocationTextColor}
          updateBillAmount={updateBillAmount}
          variantAmount={excessAmount}
          isExcess
        />
      )}

      {areContributionAllocationsLess && (
        <AllocationVarianceAlert
          isExcess={false}
          totalAllocationTextColor={totalAllocationTextColor}
          updateBillAmount={updateBillAmount}
          variantAmount={deficitAmount}
        />
      )}

      <AmountSplitBreakdownTab
        controlForAmountForm={controlForAmountForm}
        creditor={creditor}
        registeredParticipantAmountFields={registeredParticipantAmountFields}
        unregisteredParticipantAmountFields={unregisteredParticipantAmountFields}
      />

      <GradientOverlay />

      <AbsoluteKeyboardStickyButton backgroundColor="buttonCasal" position="absolute">
        <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
          Continue
        </Text>
      </AbsoluteKeyboardStickyButton>
    </Screen>
  );
};
