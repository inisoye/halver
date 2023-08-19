import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Box, Image, Text, TouchableOpacity } from '@/components';
import { EditPhoto } from '@/icons';
import {
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  useIsDarkModeSelected,
} from '@/utils';

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

interface AccountAvatarButtonProps {
  fullName: string | undefined;
  profileImageHash: string | null | undefined;
  profileImageUrl: string | null | undefined;
  handleGoToEditProfileImage: () => void;
}

export const AccountAvatarButton: React.FunctionComponent<AccountAvatarButtonProps> =
  React.memo(
    ({ fullName, profileImageHash, profileImageUrl, handleGoToEditProfileImage }) => {
      const isDarkMode = useIsDarkModeSelected();

      const initials = React.useMemo(() => getInitials(fullName), [fullName]);

      const avatarBackground = React.useMemo(() => {
        return isDarkMode
          ? getLightColorFromString(fullName)
          : getDarkColorFromString(fullName);
      }, [isDarkMode, fullName]);

      return (
        <TouchableOpacity
          alignSelf="flex-start"
          borderColor="apricot9"
          borderRadius="lg"
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
              <Text color="textInverse" fontFamily="Halver-Semibold" variant="3xl">
                {initials}
              </Text>
            </Box>
          )}
          <EditPhoto style={styles.icon} />
        </TouchableOpacity>
      );
    },
  );
