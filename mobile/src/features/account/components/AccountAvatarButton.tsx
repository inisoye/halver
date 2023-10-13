import * as React from 'react';

import { Box, Image, Text, TouchableOpacity } from '@/components';
import { EditPhoto } from '@/icons';
import {
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  useIsDarkModeSelected,
} from '@/utils';

interface AccountAvatarButtonProps {
  fullName: string | undefined;
  profileImageHash: string | null | undefined;
  profileImageUrl: string | null | undefined;
  handleGoToEditProfileImage: () => void;
}

export const AccountAvatarButton: React.FunctionComponent<AccountAvatarButtonProps> =
  React.memo(
    ({
      fullName,
      profileImageHash,
      profileImageUrl,
      handleGoToEditProfileImage,
    }) => {
      const isDarkMode = useIsDarkModeSelected();

      const initials = React.useMemo(() => getInitials(fullName), [fullName]);

      const avatarBackground = React.useMemo(() => {
        return isDarkMode
          ? getDarkColorFromString(fullName)
          : getLightColorFromString(fullName);
      }, [isDarkMode, fullName]);

      return (
        <TouchableOpacity
          alignSelf="flex-start"
          backgroundColor="elementBackground"
          borderColor="apricot9"
          borderRadius="lg"
          elevation={0.8}
          shadowColor="black"
          shadowOffset={{
            width: 0.1,
            height: 0.5,
          }}
          shadowOpacity={0.2}
          shadowRadius={0.5}
          onPress={handleGoToEditProfileImage}
        >
          {profileImageUrl ? (
            <Image
              borderRadius="lg"
              contentFit="contain"
              height={100}
              placeholder={profileImageHash}
              source={profileImageUrl}
              width={100}
            />
          ) : (
            <Box
              alignItems="center"
              borderRadius="lg"
              height={100}
              justifyContent="center"
              style={{ backgroundColor: avatarBackground }}
              width={100}
            >
              <Text fontFamily="Halver-Semibold" variant="3xl">
                {initials}
              </Text>
            </Box>
          )}

          <Box
            borderRadius="base"
            bottom={4}
            opacity={0.85}
            overflow="hidden"
            position="absolute"
            right={4}
          >
            <EditPhoto />
          </Box>
        </TouchableOpacity>
      );
    },
  );
