import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import {
  Box,
  CraftedLogo,
  DynamicText,
  Screen,
  ScrollView,
  Text,
  TouchableOpacity,
} from '@/components';
import {
  AccountAvatarButton,
  DisplayModeSelectorModal,
  LogOutModal,
  ProfileNameAndUsername,
  useUserDetails,
} from '@/features/account';
import { EditPencil } from '@/icons';
import type { AccountStackParamList } from '@/navigation';

type AccountProps = NativeStackScreenProps<AccountStackParamList, 'Account'>;

export const Account: React.FunctionComponent<AccountProps> = ({ navigation }) => {
  const { data: userDetails } = useUserDetails();
  const { profileImageHash, profileImageUrl, fullName, username, email, phone } =
    userDetails || {};

  const handleGoToEditProfileImage = React.useCallback(() => {
    navigation.navigate('Edit profile image');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoToEditPhoneNumber = React.useCallback(() => {
    navigation.navigate('Edit phone number');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen>
      <ScrollView>
        <Box flex={1} gap="10" paddingHorizontal="6" paddingVertical="2">
          <Box flexDirection="row" gap="4">
            <AccountAvatarButton
              fullName={fullName}
              handleGoToEditProfileImage={handleGoToEditProfileImage}
              profileImageHash={profileImageHash}
              profileImageUrl={profileImageUrl}
            />

            <ProfileNameAndUsername fullName={fullName} username={username} />
          </Box>

          <Box>
            <Text fontFamily="Halver-Semibold" variant="xl">
              Profile Info
            </Text>

            <Box
              alignItems="center"
              borderColor="borderDefault"
              borderTopWidth={true ? undefined : 1}
              flexDirection="row"
              gap="4"
              justifyContent="space-between"
              paddingVertical="4"
            >
              <DynamicText
                color="textLight"
                fontFamily="Halver-Semibold"
                numberOfLines={1}
                variant="sm"
                width="40%"
              >
                Email
              </DynamicText>

              <DynamicText
                fontFamily="Halver-Semibold"
                maxWidth="60%"
                numberOfLines={1}
                textAlign="right"
                variant="sm"
              >
                {email}
              </DynamicText>
            </Box>

            <TouchableOpacity
              alignItems="center"
              borderColor="borderDefault"
              borderTopWidth={0.5}
              flexDirection="row"
              gap="4"
              hitSlop={{ top: 5, bottom: 24, left: 24, right: 24 }}
              justifyContent="space-between"
              paddingTop="4"
              onPress={handleGoToEditPhoneNumber}
            >
              <DynamicText
                color="textLight"
                fontFamily="Halver-Semibold"
                numberOfLines={1}
                variant="sm"
                width="40%"
              >
                Phone
              </DynamicText>

              <Box
                alignItems="center"
                flexDirection="row"
                gap="2.5"
                justifyContent="flex-end"
                width="50%"
              >
                <DynamicText
                  fontFamily="Halver-Semibold"
                  numberOfLines={1}
                  textAlign="right"
                  variant="sm"
                  width="80%"
                >
                  {phone}
                </DynamicText>

                <EditPencil />
              </Box>
            </TouchableOpacity>
          </Box>

          <Box>
            <Text fontFamily="Halver-Semibold" variant="xl">
              Appearance
            </Text>

            <DisplayModeSelectorModal />
          </Box>

          <CraftedLogo
            containerProps={{
              alignSelf: 'center',
              marginVertical: '12',
            }}
            hasText
          />

          <LogOutModal />
        </Box>
      </ScrollView>
    </Screen>
  );
};
