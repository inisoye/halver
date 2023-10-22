import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import {
  Box,
  CraftedLogo,
  DynamicText,
  Image,
  Screen,
  ScrollView,
  Text,
  TouchableOpacity,
} from '@/components';
import {
  AccountAvatarButton,
  CloseAccountModal,
  DisplayModeSelectorModal,
  LogOutModal,
  ProfileNameAndUsername,
  useUserDetails,
} from '@/features/account';
import {
  CardIcon,
  prefetchCards,
  prefetchTransferRecipients,
} from '@/features/financials';
import { EditPencil } from '@/icons';
import type { AccountStackParamList } from '@/navigation';
import { getInitials } from '@/utils';

type AccountProps = NativeStackScreenProps<AccountStackParamList, 'Account'>;

export const Account: React.FunctionComponent<AccountProps> = ({
  navigation,
}) => {
  const queryClient = useQueryClient();

  const { data: userDetails } = useUserDetails();
  const {
    profileImageHash,
    profileImageUrl,
    fullName,
    username,
    email,
    phone,
    defaultCard,
    defaultTransferRecipient,
  } = userDetails || {};

  const handleGoToEditProfileImage = () => {
    navigation.navigate('Edit profile image');
  };

  const handleGoToEditPhoneNumber = () => {
    navigation.navigate('Edit phone number');
  };

  const goToCards = () => {
    prefetchCards(queryClient);
    navigation.navigate('Cards');
  };

  const goToTransferRecipients = () => {
    prefetchTransferRecipients(queryClient);
    navigation.navigate('Transfer recipients');
  };

  const { cardType, last4 } = defaultCard || {};
  const { bankLogo, accountNumber, bankName } = defaultTransferRecipient || {};
  const initials = React.useMemo(() => getInitials(bankName), [bankName]);

  return (
    <Screen>
      <ScrollView>
        <Box
          flex={1}
          gap="8"
          paddingBottom="12"
          paddingHorizontal="6"
          paddingTop="2"
        >
          <Box
            alignItems="stretch"
            borderRadius="lg"
            flexDirection="row"
            gap="4"
            overflow="hidden"
          >
            <AccountAvatarButton
              fullName={fullName}
              handleGoToEditProfileImage={handleGoToEditProfileImage}
              profileImageHash={profileImageHash}
              profileImageUrl={profileImageUrl}
            />

            <ProfileNameAndUsername fullName={fullName} username={username} />
          </Box>

          <Box
            backgroundColor="elementBackground"
            borderRadius="lg"
            elevation={0.5}
            paddingHorizontal="4"
            paddingVertical="4"
            shadowColor="black"
            shadowOffset={{
              width: 0.2,
              height: 0.3,
            }}
            shadowOpacity={0.2}
            shadowRadius={0.3}
          >
            <Text fontFamily="Halver-Semibold" marginBottom="4" variant="lg">
              Profile Info
            </Text>

            <Box
              alignItems="center"
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

          <Box
            backgroundColor="elementBackground"
            borderRadius="lg"
            elevation={0.5}
            paddingHorizontal="4"
            paddingVertical="4"
            shadowColor="black"
            shadowOffset={{
              width: 0.2,
              height: 0.3,
            }}
            shadowOpacity={0.2}
            shadowRadius={0.3}
          >
            <Text fontFamily="Halver-Semibold" marginBottom="4" variant="lg">
              Appearance
            </Text>

            <DisplayModeSelectorModal />
          </Box>

          {(!!defaultCard || !!defaultTransferRecipient) && (
            <Box
              backgroundColor="elementBackground"
              borderRadius="lg"
              elevation={0.5}
              paddingHorizontal="4"
              paddingVertical="4"
              shadowColor="black"
              shadowOffset={{
                width: 0.2,
                height: 0.3,
              }}
              shadowOpacity={0.2}
              shadowRadius={0.3}
            >
              <Text fontFamily="Halver-Semibold" marginBottom="4" variant="lg">
                Default financial details
              </Text>

              {!!defaultCard && (
                <TouchableOpacity
                  alignItems="center"
                  flexDirection="row"
                  gap="4"
                  hitSlop={{ top: 5, bottom: 24, left: 24, right: 24 }}
                  justifyContent="space-between"
                  paddingVertical="4"
                  onPress={goToCards}
                >
                  <DynamicText
                    color="textLight"
                    fontFamily="Halver-Semibold"
                    numberOfLines={1}
                    variant="sm"
                    width="40%"
                  >
                    Card
                  </DynamicText>

                  <Box
                    alignItems="center"
                    flexDirection="row"
                    gap="2.5"
                    justifyContent="flex-end"
                    width="50%"
                  >
                    <Box alignItems="center" columnGap="1" flexDirection="row">
                      <CardIcon type={cardType} />
                      <DynamicText
                        fontFamily="Halver-Semibold"
                        marginLeft="1"
                        numberOfLines={1}
                        textAlign="right"
                        variant="sm"
                      >
                        •••• {last4}
                      </DynamicText>
                    </Box>

                    <EditPencil />
                  </Box>
                </TouchableOpacity>
              )}

              {!!defaultTransferRecipient && (
                <TouchableOpacity
                  alignItems="center"
                  flexDirection="row"
                  gap="4"
                  hitSlop={{ top: 5, bottom: 24, left: 24, right: 24 }}
                  justifyContent="space-between"
                  paddingTop="4"
                  onPress={goToTransferRecipients}
                >
                  <DynamicText
                    color="textLight"
                    fontFamily="Halver-Semibold"
                    numberOfLines={1}
                    variant="sm"
                    width="40%"
                  >
                    Transfer recipient
                  </DynamicText>

                  <Box
                    alignItems="center"
                    flexDirection="row"
                    gap="2.5"
                    justifyContent="flex-end"
                    width="50%"
                  >
                    <Box alignItems="center" columnGap="1" flexDirection="row">
                      <Box
                        backgroundColor="elementBackground"
                        borderRadius="base"
                        elevation={1}
                        shadowColor="black"
                        shadowOffset={{
                          width: 0.1,
                          height: 0.3,
                        }}
                        shadowOpacity={0.3}
                        shadowRadius={0.2}
                      >
                        {bankLogo ? (
                          <Image
                            backgroundColor={
                              bankLogo ? 'white' : 'bankImageBackground'
                            }
                            borderRadius="base"
                            contentFit="contain"
                            height={24}
                            source={bankLogo}
                            width={24}
                          />
                        ) : (
                          <Box
                            alignItems="center"
                            backgroundColor="white"
                            borderRadius="base"
                            height={24}
                            justifyContent="center"
                            width={24}
                          >
                            <Text
                              color="textBlack"
                              fontFamily="Halver-Semibold"
                              variant="sm"
                            >
                              {initials}
                            </Text>
                          </Box>
                        )}
                      </Box>

                      <DynamicText
                        fontFamily="Halver-Semibold"
                        marginLeft="1"
                        numberOfLines={1}
                        textAlign="right"
                        variant="sm"
                      >
                        {accountNumber}
                      </DynamicText>
                    </Box>

                    <EditPencil />
                  </Box>
                </TouchableOpacity>
              )}
            </Box>
          )}

          <CraftedLogo
            containerProps={{
              alignSelf: 'center',
            }}
            hasText
          />

          <LogOutModal />

          <CloseAccountModal />
        </Box>
      </ScrollView>
    </Screen>
  );
};
