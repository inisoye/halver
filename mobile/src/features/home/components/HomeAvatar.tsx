import * as React from 'react';

import { Box, Image, Text, TouchableOpacity } from '@/components';
import { useUserDetails } from '@/features/account';
import { navigateWithoutNavigationProp } from '@/lib/react-navigation';
import { getInitials, getLightColorFromString } from '@/utils';

export const HomeAvatar = () => {
  const { data: userDetails } = useUserDetails();

  const { fullName, profileImageHash, profileImageUrl } = userDetails || {};

  const initials = getInitials(fullName);

  const avatarBackground = getLightColorFromString(fullName);
  const hasImage = !!profileImageUrl;

  const goToAccountScreen = () => {
    navigateWithoutNavigationProp('AccountStackNavigator');
  };

  return (
    <TouchableOpacity
      alignItems="center"
      backgroundColor="elementBackground"
      borderRadius="md"
      elevation={0.5}
      flexDirection="row"
      gap="4"
      shadowColor="black"
      shadowOffset={{
        width: 0.1,
        height: 0.3,
      }}
      shadowOpacity={0.2}
      shadowRadius={0.3}
      onPress={goToAccountScreen}
    >
      {hasImage ? (
        <Image
          borderRadius="base"
          contentFit="contain"
          height={28}
          placeholder={profileImageHash}
          source={profileImageUrl}
          width={28}
        />
      ) : (
        <Box
          alignItems="center"
          borderRadius="base"
          height={28}
          justifyContent="center"
          style={{ backgroundColor: avatarBackground }}
          width={28}
        >
          <Text
            color="textBlack"
            fontFamily="Halver-Semibold"
            opacity={0.85}
            variant="sm"
          >
            {initials}
          </Text>
        </Box>
      )}
    </TouchableOpacity>
  );
};
