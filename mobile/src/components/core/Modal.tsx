import Constants from 'expo-constants';
import * as React from 'react';
import { Animated, Pressable, Modal as RNModal, View } from 'react-native';

import { useButtonAnimation } from '@/hooks';
import { CloseModal } from '@/icons';
import { cn, isIOS } from '@/utils';

import { LogoLoader } from './LogoLoader';
import { Text } from './Text';

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  closeModal: () => void;
  isLoaderOpen: boolean;
  isModalOpen: boolean;
  headingText?: string;
  hasLargeHeading?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Modal: React.FunctionComponent<ModalProps> = ({
  children,
  className,
  closeModal,
  isLoaderOpen = false,
  isModalOpen,
  headingText,
  hasLargeHeading,
}) => {
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation();

  return (
    <RNModal animationType="slide" transparent={true} visible={isModalOpen}>
      <View className={cn('flex-1 justify-end bg-main-bg-light dark:bg-[#0D0D0D]', className)}>
        <View
          className="mt-auto flex-row items-center justify-between px-6 py-4"
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginTop: isIOS() ? Constants.statusBarHeight : 0,
            gap: 16,
          }}
        >
          <Text variant={hasLargeHeading ? '2xl' : 'xl'} weight="bold">
            {headingText}
          </Text>

          <AnimatedPressable
            style={animatedStyle}
            onPress={closeModal}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <CloseModal />
          </AnimatedPressable>
        </View>

        {isLoaderOpen && <LogoLoader />}

        {children}
      </View>
    </RNModal>
  );
};
