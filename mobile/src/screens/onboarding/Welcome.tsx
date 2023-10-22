import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { useMMKVBoolean } from 'react-native-mmkv';
import { FadeIn } from 'react-native-reanimated';

import {
  AbsoluteKeyboardStickyButton,
  AnimatedImage,
  AnimatedText,
  AnimatedTouchableOpacity,
  Box,
  Screen,
  ScrollView,
  Text,
} from '@/components';
import { HalverWebsiteModal } from '@/features/account';
import { useActionStatusCounts } from '@/features/home';
import { useBooleanStateControl } from '@/hooks';
import { allMMKVKeys } from '@/lib/mmkv';
import { OnboardingStackParamList } from '@/navigation';

type _WelcomeProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'Welcome'
>;

export const Welcome = () => {
  const { data: statusCounts } = useActionStatusCounts();

  const statusCountsObject = React.useMemo(() => {
    if (!statusCounts || statusCounts.length < 1) return {};

    type StatusType = (typeof statusCounts)[number]['status'];

    const result: Partial<{ [key in StatusType]: number }> = {};
    statusCounts.forEach(({ status, count }) => {
      result[status] = count;
    });

    return result;
  }, [statusCounts]);

  const { overdue = 0, pending = 0 } = statusCountsObject;
  const totalPending = overdue + pending;

  const pluralSuffix = totalPending > 1 ? 's' : '';
  const welcomeSubheading = totalPending
    ? `Looks like you have already been added to ${totalPending} bill${pluralSuffix}.`
    : 'Thanks for joining. Have a great time halvering.';

  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const [_isFirstTime, setIsFirstTime] = useMMKVBoolean(
    allMMKVKeys.isFirstTime,
  );

  const onComplete = React.useCallback(async () => {
    setIsFirstTime(false);
  }, [setIsFirstTime]);

  return (
    <>
      <Screen
        backgroundColor="billScreenBackground"
        isHeaderShown={false}
        hasNoIOSBottomInset
      >
        <Box backgroundColor="background" flex={1}>
          <ScrollView scrollEventThrottle={200}>
            <Box
              backgroundColor="billScreenBackground"
              borderBottomEndRadius="2xl"
              borderBottomStartRadius="2xl"
              padding="6"
              paddingTop="16"
            >
              <AnimatedText
                entering={FadeIn.duration(1000)}
                flexShrink={1}
                fontFamily="Halver-Semibold"
                marginBottom="4"
                numberOfLines={2}
                textAlign="center"
                variant="4xl"
              >
                Welcome to Halver
              </AnimatedText>

              <AnimatedText
                color="textLight"
                entering={FadeIn.duration(1000).delay(500)}
                lineHeight={24}
                marginBottom="14"
                textAlign="center"
                variant="xl"
              >
                {welcomeSubheading}
              </AnimatedText>

              <AnimatedImage
                borderRadius="lg"
                contentFit="contain"
                entering={FadeIn.duration(1000).delay(1000)}
                flex={1}
                height={142}
                marginBottom="14"
                placeholder="e8E.FK00YOR4IV-S0fT2;1_2MxRPAI~An-%e?HDkE1E3s%N2xDpbix"
                source="https://res.cloudinary.com/dvqa4te6q/image/upload/v1698005851/meta_images/illustrations_cluster.png"
              />

              <AnimatedText
                color="textLight"
                entering={FadeIn.duration(1000).delay(1500)}
                textAlign="center"
                variant="sm"
              >
                Need help with understanding Halver?
              </AnimatedText>

              <AnimatedTouchableOpacity
                entering={FadeIn.duration(1000).delay(1500)}
                hitSlop={10}
                onPress={openModal}
              >
                <Text
                  color="textApricot"
                  textAlign="center"
                  textDecorationLine="underline"
                  variant="sm"
                >
                  Click here
                </Text>
              </AnimatedTouchableOpacity>
            </Box>
          </ScrollView>
        </Box>

        <AbsoluteKeyboardStickyButton
          backgroundColor="buttonCasal"
          onPress={onComplete}
        >
          <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
            Continue
          </Text>
        </AbsoluteKeyboardStickyButton>
      </Screen>

      <HalverWebsiteModal closeModal={closeModal} isModalOpen={isModalOpen} />
    </>
  );
};
