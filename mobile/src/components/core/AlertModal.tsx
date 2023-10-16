import Constants from 'expo-constants';
import * as React from 'react';
import { Modal as RNModal } from 'react-native';

import { SuccessTick } from '@/icons';
import { isIOS, useIsDarkModeSelected } from '@/utils';

import { Box } from './Box';
import { LogoLoader } from './LogoLoader';
import { Text } from './Text';

interface AlertModalProps {
  children: React.ReactNode;
  closeModal?: () => void;
  isLoaderOpen: boolean;
  isModalOpen: boolean;
  headingText?: string;
  hasLargeHeading?: boolean;
  hasCloseButton?: boolean;
}

export const SuccessModal: React.FunctionComponent<AlertModalProps> = ({
  children,
  isLoaderOpen = false,
  isModalOpen,
  headingText,
  hasLargeHeading,
}) => {
  const isDarkMode = useIsDarkModeSelected();

  return (
    <RNModal animationType="fade" transparent={true} visible={isModalOpen}>
      <Box
        backgroundColor={isDarkMode ? 'greenNight' : 'green5'}
        flex={1}
        justifyContent="flex-end"
      >
        <Box
          alignItems="center"
          backgroundColor="successModalHeadingBackground"
          flexDirection="row"
          gap="4"
          justifyContent="space-between"
          paddingVertical="4"
          style={[
            { marginTop: isIOS() ? Constants.statusBarHeight : undefined },
          ]}
        >
          <Box marginLeft="6" maxWidth="65%" width="100%">
            <Text
              color="green12"
              fontFamily="Halver-Semibold"
              variant={hasLargeHeading ? '2xl' : 'xl'}
            >
              {headingText}
            </Text>
          </Box>

          <SuccessTick />
        </Box>

        {isLoaderOpen && <LogoLoader />}

        {children}
      </Box>
    </RNModal>
  );
};
