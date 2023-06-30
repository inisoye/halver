import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { NativeSyntheticEvent } from 'react-native';
import type { default as PagerViewType } from 'react-native-pager-view';

import {
  AbsoluteKeyboardStickyButton,
  Box,
  DynamicText,
  Image,
  PagerView,
  Pressable,
  Screen,
  Text,
} from '@/components';
import { useUserDetails } from '@/features/account';
import {
  AmountSplitBreakdownTabs,
  EvenSplitBreakdownTabs,
  formatParticipantsData,
  formatUnregisteredParticipantsData,
  GradientOverlay,
  SelectCreditorModal,
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

type SplitBreakdownProps = NativeStackScreenProps<
  AppRootStackParamList,
  'Split Breakdown'
>;

export const SplitBreakdown: React.FunctionComponent<SplitBreakdownProps> = () => {
  const pagerRef = React.useRef<PagerViewType>(null);
  const [activePage, setActivePage] = React.useState(0);
  const { data: creatorDetails } = useUserDetails();
  const isDarkMode = useIsDarkMode();

  const {
    newBillPayload,
    numberOfSelections,
    selectedRegisteredParticipants,
    selectedUnregisteredParticipants,
  } = useBillPayloadWithSelectionDetails();

  const evenAmount =
    numberOfSelections > 0
      ? Number(newBillPayload?.totalAmountDue) / numberOfSelections
      : 0;

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
      contribution: String(evenAmount) || '0',
    };
  }, [creatorDetails, evenAmount]);

  const [creditor, setCreditor] = React.useState(formattedCreatorDetails);

  const { formattedRegisteredParticipants, formattedUnregisteredParticipants } =
    React.useMemo(() => {
      return {
        formattedRegisteredParticipants: [
          formattedCreatorDetails,
          ...formatParticipantsData(
            selectedRegisteredParticipants,
            evenAmount,
            formattedCreatorDetails,
          ),
        ],
        formattedUnregisteredParticipants: formatUnregisteredParticipantsData(
          selectedUnregisteredParticipants,
          evenAmount,
          formattedCreatorDetails,
        ),
      };
    }, [
      evenAmount,
      formattedCreatorDetails,
      selectedRegisteredParticipants,
      selectedUnregisteredParticipants,
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
  }, [creditor.name, creditor.uuid, formattedCreatorDetails.uuid, isDarkMode]);

  const { control: controlForAmountForm } = useForm({
    defaultValues: {
      registeredParticipants: formattedRegisteredParticipants,
      unregisteredParticipants: formattedUnregisteredParticipants,
    },
  });

  const allValues = useWatch({ control: controlForAmountForm });

  const { fields: registeredParticipantAmountFields } = useFieldArray({
    control: controlForAmountForm,
    name: 'registeredParticipants',
  });

  const { fields: unregisteredParticipantAmountFields } = useFieldArray({
    control: controlForAmountForm,
    name: 'unregisteredParticipants',
  });

  const goToPage = (page: number) => {
    if (pagerRef.current) {
      pagerRef.current.setPage(page);
    }
  };

  const handlePageChange = (
    event: NativeSyntheticEvent<
      Readonly<{
        position: number;
      }>
    >,
  ) => {
    setActivePage(event.nativeEvent.position);
  };

  const slides = [
    {
      name: 'Split evenly',
      description: `Everyone pays the same share - about ${convertNumberToNaira(
        evenAmount,
      )}`,
    },
    {
      name: 'Split by amount',
      description: 'Specify the amount each person pays',
    },
  ];

  const selection = slides[activePage].name;
  const activeDescription = slides[activePage].description;

  return (
    <Screen hasNoIOSBottomInset>
      <Box
        alignItems="center"
        backgroundColor="inputBackground"
        flexDirection="row"
        gap="2"
        justifyContent="space-between"
        marginBottom="8"
        marginTop="1.5"
        paddingHorizontal="6"
        paddingVertical="2.5"
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
        flexDirection="row"
        gap="2"
        marginBottom="6"
        marginLeft="auto"
        marginRight="auto"
        paddingHorizontal="6"
      >
        {slides.map(({ name }, index) => {
          const isSelected = selection === name;

          return (
            <Pressable
              animateScale={true}
              animateTranslate={false}
              backgroundColor={
                isSelected
                  ? 'radioButtonBackgroundSelected'
                  : 'radioButtonBackgroundDefault'
              }
              borderRadius="md"
              flex={0}
              handlePressOut={() => goToPage(index)}
              key={name}
              paddingHorizontal="4"
              paddingVertical="2"
            >
              <Text
                color={isSelected ? 'textInverse' : 'textLight'}
                fontFamily={isSelected ? 'Halver-Semibold' : 'Halver-Medium'}
                textAlign="center"
                variant="sm"
              >
                {name}
              </Text>
            </Pressable>
          );
        })}
      </Box>

      <DynamicText
        color="textLight"
        marginBottom="3"
        marginLeft="auto"
        marginRight="auto"
        paddingHorizontal="6"
        textAlign="center"
        variant="xs"
      >
        {activeDescription}
      </DynamicText>

      <PagerView
        flex={1}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={handlePageChange}
      >
        <Box key="1">
          <EvenSplitBreakdownTabs
            creditor={creditor}
            formattedParticipants={formattedRegisteredParticipants}
            formattedUnregisteredParticipants={formattedUnregisteredParticipants}
          />
        </Box>

        <Box key="2">
          <AmountSplitBreakdownTabs
            controlForAmountForm={controlForAmountForm}
            creditor={creditor}
            registeredParticipantAmountFields={registeredParticipantAmountFields}
            unregisteredParticipantAmountFields={unregisteredParticipantAmountFields}
          />
        </Box>
      </PagerView>

      <GradientOverlay />

      <AbsoluteKeyboardStickyButton backgroundColor="buttonCasal" position="absolute">
        <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
          Continue
        </Text>
      </AbsoluteKeyboardStickyButton>
    </Screen>
  );
};
