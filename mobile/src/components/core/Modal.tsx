import Constants from 'expo-constants';
import * as React from 'react';
import { Animated, Pressable, Modal as RNModal, View } from 'react-native';

import { useButtonAnimation } from '@/hooks';
import { CloseModal } from '@/icons';
import { isIOS } from '@/utils';

import { LogoLoader } from './LogoLoader';
import { Text } from './Text';

interface ModalProps {
  children: React.ReactNode;
  closeModal: () => void;
  isLoaderOpen: boolean;
  isModalOpen: boolean;
}

export const Modal: React.FunctionComponent<ModalProps> = ({
  children,
  closeModal,
  isLoaderOpen = false,
  isModalOpen,
}) => {
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation();

  return (
    <RNModal animationType="slide" transparent={true} visible={isModalOpen}>
      <View className="flex-1 justify-end bg-main-bg-light dark:bg-grey-dark-50">
        <View
          className="mt-auto flex-row items-center justify-between px-6 py-4"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: isIOS() ? Constants.statusBarHeight : 0,
            gap: 16,
          }}
        >
          <Text variant="xl" weight="bold">
            Card addition payment
          </Text>

          <Pressable onPress={closeModal} onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View style={animatedStyle}>
              <CloseModal />
            </Animated.View>
          </Pressable>
        </View>

        {isLoaderOpen && <LogoLoader />}

        {children}
      </View>
    </RNModal>
  );
};
