import Constants from 'expo-constants';
import * as React from 'react';
import { Modal as RNModal } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';

import { CloseModal } from '@/icons';
import { isIOS, useIsDarkModeSelected } from '@/utils';

import { AfterInteractions } from './AfterInteractions';
import { AnimatedBox, Box } from './Box';
import { LogoLoader } from './LogoLoader';
import { Pressable } from './Pressable';
import { Text } from './Text';

interface ModalProps {
  children: React.ReactNode;
  closeModal: () => void;
  isLoaderOpen: boolean;
  isModalOpen: boolean;
  headingText?: string;
  headingComponent?: React.ReactNode;
  hasLargeHeading?: boolean;
  hasCloseButton?: boolean;
}

export const Modal: React.FunctionComponent<ModalProps> = ({
  children,
  closeModal,
  isLoaderOpen = false,
  isModalOpen,
  headingText,
  headingComponent,
  hasLargeHeading,
  hasCloseButton = true,
}) => {
  const isDarkMode = useIsDarkModeSelected();

  return (
    <RNModal animationType="slide" transparent={true} visible={isModalOpen}>
      <Box
        backgroundColor={isDarkMode ? 'blackish' : 'gray6'}
        flex={1}
        justifyContent="flex-end"
      >
        <Box
          alignItems="center"
          flexDirection="row"
          gap="4"
          justifyContent="space-between"
          paddingBottom={isLoaderOpen ? undefined : '3'}
          paddingTop="4"
          style={[{ marginTop: isIOS() ? Constants.statusBarHeight : undefined }]}
        >
          <AnimatedBox
            entering={FadeInDown.duration(50).springify().delay(200)}
            marginLeft="6"
            maxWidth="70%"
            width="100%"
          >
            {!!headingText && (
              <Text
                fontFamily="Halver-Semibold"
                variant={hasLargeHeading ? '2xl' : 'xl'}
              >
                {headingText}
              </Text>
            )}

            {headingComponent}
          </AnimatedBox>

          {hasCloseButton && (
            <Pressable marginRight="6" onPress={closeModal}>
              <CloseModal />
            </Pressable>
          )}
        </Box>

        <AfterInteractions>{isLoaderOpen && <LogoLoader />}</AfterInteractions>

        {children}
      </Box>
    </RNModal>
  );
};
