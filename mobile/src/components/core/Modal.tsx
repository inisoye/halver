import Constants from 'expo-constants';
import * as React from 'react';
import { Animated, Pressable, Modal as RNModal, View } from 'react-native';

import { useButtonAnimation } from '@/hooks';
import { CloseModal } from '@/icons';
import { gapStyles } from '@/theme';
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
  hasCloseButton?: boolean;
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
  hasCloseButton = true,
}) => {
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation();

  return (
    <RNModal animationType="slide" transparent={true} visible={isModalOpen}>
      <View
        className={cn(
          'flex-1 justify-end bg-main-bg-light dark:bg-[#0D0D0D]',
          className,
        )}
      >
        <View
          className="mt-auto flex-row items-center justify-between  py-4"
          style={[
            { marginTop: isIOS() ? Constants.statusBarHeight : undefined },
            gapStyles[16],
          ]}
        >
          <View className="ml-6 w-full max-w-[70%]">
            <Text variant={hasLargeHeading ? '2xl' : 'xl'} weight="bold">
              {headingText}
            </Text>
          </View>

          {hasCloseButton && (
            <AnimatedPressable
              className="mr-6"
              style={animatedStyle}
              onPress={closeModal}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <CloseModal />
            </AnimatedPressable>
          )}
        </View>

        {isLoaderOpen && <LogoLoader />}

        {children}
      </View>
    </RNModal>
  );
};
