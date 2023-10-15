import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import { FadeIn } from 'react-native-reanimated';

import {
  AnimatedTouchableOpacity,
  Box,
  DynamicText,
  Text,
  TouchableOpacity,
} from '@/components';
import { useUserDetails } from '@/features/account';
import { useAreNotificationsEnabled } from '@/hooks';
import { AddBank, AddCard, AddPhoto, EnableNotifications } from '@/icons';
import {
  AppRootStackParamList,
  HomeStackParamList,
  TabParamList,
} from '@/navigation';
import { openAppSettings } from '@/utils';

interface TodosProps {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<AppRootStackParamList, 'Home', undefined>,
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'HomeStackNavigator', undefined>,
      NativeStackNavigationProp<HomeStackParamList, 'Home', undefined>
    >
  >;
}

export const Todos: React.FunctionComponent<TodosProps> = ({ navigation }) => {
  const { data: userDetails } = useUserDetails();
  const {
    data: areNotificationsEnabled,
    isLoading: isNotificationStatusLoading,
  } = useAreNotificationsEnabled();

  const {
    defaultCard,
    defaultTransferRecipient,
    profileImageHash,
    profileImageUrl,
  } = userDetails || {};

  const allTodos = [
    {
      name: 'Add your card',
      status: !!defaultCard,
      heading: 'Add your card',
      subtitle: 'Start making contributions',
      icon: <AddCard />,
      color: 'indigo',
    },
    {
      name: 'Add a recipient',
      status: !!defaultTransferRecipient,
      heading: 'Add your account',
      subtitle: 'Collect contributions',
      icon: <AddBank />,
      color: 'plum',
    },
    {
      name: 'Edit profile image',
      status: !!profileImageUrl && !!profileImageHash,
      heading: 'Add your photo',
      subtitle: 'Be easily recognisable',
      icon: <AddPhoto />,
      color: 'crimson',
    },
  ] as const;

  const pendingTodos = allTodos.filter(({ status }) => !status);

  const isOnlyOneTodo = pendingTodos.length === 1;
  const hasPendingTodos = pendingTodos.length > 0;

  const isNotificationAlertDisplayed =
    !isNotificationStatusLoading && !areNotificationsEnabled;

  return (
    (hasPendingTodos || isNotificationAlertDisplayed) && (
      <Box marginBottom="10">
        <DynamicText fontFamily="Halver-Semibold" marginBottom="3" variant="xl">
          Still to be done
        </DynamicText>

        {hasPendingTodos && (
          <Box
            flexDirection="row"
            gap="3"
            justifyContent="space-between"
            marginBottom={isNotificationAlertDisplayed ? '3' : undefined}
          >
            {pendingTodos.map(({ name, heading, subtitle, icon, color }) => {
              const goToScreen = () => {
                navigation.navigate(name);
              };

              return (
                <TouchableOpacity
                  backgroundColor={`${color}3`}
                  borderRadius="lg"
                  elevation={1}
                  flexBasis="31%"
                  flexDirection={isOnlyOneTodo ? 'row' : undefined}
                  flexGrow={1}
                  justifyContent={isOnlyOneTodo ? 'space-between' : undefined}
                  key={name}
                  paddingVertical="3"
                  shadowColor="black"
                  shadowOffset={{
                    width: 0.1,
                    height: 0.1,
                  }}
                  shadowOpacity={0.2}
                  shadowRadius={0.3}
                  onPress={goToScreen}
                >
                  <Box
                    borderBottomColor={`${color}4`}
                    borderBottomWidth={isOnlyOneTodo ? undefined : 1}
                    gap="2"
                    paddingBottom={isOnlyOneTodo ? undefined : '2.5'}
                    paddingHorizontal="3"
                  >
                    <Text color={`${color}12`} fontFamily="Halver-Semibold">
                      {heading}
                    </Text>
                    <Text
                      color={`${color}12`}
                      fontFamily="Halver-Semibold"
                      opacity={0.5}
                      variant="xxs"
                    >
                      {subtitle}
                    </Text>
                  </Box>

                  <Box paddingHorizontal="3" paddingTop="2">
                    {icon}
                  </Box>
                </TouchableOpacity>
              );
            })}
          </Box>
        )}

        {isNotificationAlertDisplayed && (
          <AnimatedTouchableOpacity
            backgroundColor="brown3"
            borderRadius="lg"
            elevation={1}
            entering={FadeIn}
            flexBasis="31%"
            flexDirection="row"
            flexGrow={1}
            justifyContent="space-between"
            paddingHorizontal="3"
            paddingVertical="4"
            shadowColor="black"
            shadowOffset={{
              width: 0.1,
              height: 0.1,
            }}
            shadowOpacity={0.2}
            shadowRadius={0.3}
            onPress={openAppSettings}
          >
            <Box flexShrink={1} gap="2">
              <Text color="brown12" fontFamily="Halver-Semibold">
                Allow notifications
              </Text>
              <DynamicText
                color="brown12"
                fontFamily="Halver-Semibold"
                maxWidth="90%"
                opacity={0.5}
                variant="xxs"
              >
                Notifications are quite crucial on Halver. They help you know
                when your payments are successful and when you have been added
                to bills.
              </DynamicText>
            </Box>

            <EnableNotifications />
          </AnimatedTouchableOpacity>
        )}
      </Box>
    )
  );
};
