import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  Box,
  DynamicText,
  FullWidthTextField,
  Image,
  KeyboardStickyButton,
  LogoLoader,
  Screen,
  Text,
} from '@/components';
import {
  ContactsContinueButton,
  ContactsList,
  GradientOverlay,
  usePhoneContacts,
  ViewContactSelectionsModal,
} from '@/features/new-bill';
import { Search } from '@/icons';
import type { AppRootStackParamList } from '@/navigation';
import { isIOS, openAppSettings, useIsDarkModeSelected } from '@/utils';

type BillParticipantsProps = NativeStackScreenProps<
  AppRootStackParamList,
  'Select Participants'
>;

export const BillParticipants = ({ navigation }: BillParticipantsProps) => {
  const { isLoading: areContactsLoading, data: phoneContactsResponse } =
    usePhoneContacts();
  const { status: contactsPermissionStatus } = phoneContactsResponse || {};

  const contactsPermissionGranted =
    !areContactsLoading && contactsPermissionStatus === 'granted';
  const contactsPermissionDenied =
    !areContactsLoading &&
    (contactsPermissionStatus === 'denied' ||
      contactsPermissionStatus === 'undetermined');

  const { control: controlForContactFilter } = useForm<{
    contactFilter: string;
  }>({
    defaultValues: {
      contactFilter: '',
    },
  });

  const contactsFilterValue = useWatch({
    control: controlForContactFilter,
    name: 'contactFilter',
  });

  const isDarkMode = useIsDarkModeSelected();

  const imageBaseURL =
    'https://res.cloudinary.com/dvqa4te6q/image/upload/v1694057580/contacts_help_images/';
  const iosImageName = isDarkMode
    ? 'ios-contacts-dark_o7djtp.png'
    : 'ios-contacts-light_vixinl.png';
  const androidImageName = isDarkMode
    ? 'android-contacts-dark_tuzpqb.png'
    : 'android-contacts-light_rga1ba.png';
  const imageUrl = isIOS()
    ? imageBaseURL + iosImageName
    : imageBaseURL + androidImageName;

  return (
    <Screen headerProps={{ paddingBottom: '2.5' }} hasNoIOSBottomInset>
      <Box backgroundColor="transparent" height={12}>
        {areContactsLoading && <LogoLoader />}
      </Box>

      {contactsPermissionDenied && (
        <Box flex={1}>
          <Box flex={1} paddingHorizontal="6">
            <Text marginBottom="6">
              To select participants on your bill, please grant Halver access to
              your contacts.
            </Text>

            <Box
              backgroundColor="elementBackground"
              borderRadius="lg"
              gap="3"
              padding="3"
            >
              {/* Image styles based on: https://stackoverflow.com/a/61708419 */}
              <Box flexDirection="row">
                <Image
                  aspectRatio={isIOS() ? 1.944 : 1.305}
                  borderRadius="lg"
                  contentFit="contain"
                  flex={1}
                  source={imageUrl}
                />
              </Box>

              <DynamicText
                color="textLight"
                paddingHorizontal="4"
                textAlign="center"
                variant="sm"
              >
                <Text
                  color="textCasal"
                  fontFamily="Halver-Semibold"
                  variant="sm"
                  onPress={openAppSettings}
                >
                  Click here
                </Text>{' '}
                to go to settings and
                {isIOS()
                  ? ' toggle the contacts option as shown above.'
                  : ' select allow as shown above.'}
              </DynamicText>
            </Box>
          </Box>

          <KeyboardStickyButton
            backgroundColor="buttonCasal"
            onPress={openAppSettings}
          >
            <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
              Go to settings
            </Text>
          </KeyboardStickyButton>
        </Box>
      )}

      {contactsPermissionGranted && (
        <>
          <FullWidthTextField
            autoFocus={false}
            containerProps={{ marginTop: '0' }}
            control={controlForContactFilter}
            name="contactFilter"
            paddingHorizontal="0"
            placeholder="Search for a contact"
            prefixComponent={<Search />}
            suffixComponent={
              <ViewContactSelectionsModal navigation={navigation} />
            }
          />

          <ContactsList contactsFilterValue={contactsFilterValue} />

          <GradientOverlay />

          <ContactsContinueButton navigation={navigation} />
        </>
      )}
    </Screen>
  );
};
