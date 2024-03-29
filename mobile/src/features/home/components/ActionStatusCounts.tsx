import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import type { ISvgProps } from 'svg.types';

import {
  Box,
  CraftedLogoSmall,
  Pressable,
  Skeleton,
  Text,
  TouchableOpacity,
} from '@/components';
import {
  NewBillSmall as NewBillSmallIcon,
  Overdue as OverdueIcon,
  Pending as PendingIcon,
  Recurring as RecurringIcon,
} from '@/icons';
import {
  AppRootStackParamList,
  HomeStackParamList,
  TabParamList,
} from '@/navigation';
import { isAndroid } from '@/utils';

import { useActionStatusCounts } from '../api';

export const actionStatusColors = {
  Pending: 'pendingActionStatusBackground',
  Overdue: 'overdueActionStatusBackground',
  Recurring: 'recurringActionStatusBackground',
} as const;

interface ActionStatusButtonProps {
  count: number;
  icon: React.FunctionComponent<ISvgProps>;
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<AppRootStackParamList, 'Home', undefined>,
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'HomeStackNavigator', undefined>,
      NativeStackNavigationProp<HomeStackParamList, 'Home', undefined>
    >
  >;
  status: keyof typeof actionStatusColors;
  disabled: boolean;
  isLoading: boolean;
}

const ActionStatusButton: React.FunctionComponent<ActionStatusButtonProps> = ({
  count,
  disabled,
  icon: Icon,
  navigation,
  status,
  isLoading,
}) => {
  const goToBillsByStatus = () => {
    navigation.navigate('Bills by status', {
      status,
    });
  };

  if (isLoading) {
    return (
      <Skeleton
        borderRadius="lg"
        flexBasis="48%"
        flexDirection="row"
        flexGrow={1}
        gap="4"
        padding="4"
      >
        <Text
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
          opacity={0}
        >
          <Text fontFamily="Halver-Semibold" variant="xl">
            {count}
            {'\n'}
          </Text>

          <Text
            color="textLighter"
            lineHeight={isAndroid() ? 20 : 16}
            variant="xs"
          >
            {status}
          </Text>
        </Text>

        <Box
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
          opacity={0}
        >
          <Icon />
        </Box>
      </Skeleton>
    );
  }

  return (
    <TouchableOpacity
      backgroundColor={actionStatusColors[status]}
      borderRadius="lg"
      disabled={disabled}
      elevation={1}
      flexBasis="48%"
      flexDirection="row"
      flexGrow={1}
      gap="4"
      justifyContent="space-between"
      padding="4"
      shadowColor="black"
      shadowOffset={{
        width: 0.1,
        height: 0.1,
      }}
      shadowOpacity={0.2}
      shadowRadius={0.3}
      onPress={goToBillsByStatus}
    >
      <Text>
        <Text fontFamily="Halver-Semibold" variant="xl">
          {count}
          {'\n'}
        </Text>

        <Text
          color="textLighter"
          lineHeight={isAndroid() ? 20 : 16}
          variant="xs"
        >
          {status}
        </Text>
      </Text>

      <Icon />
    </TouchableOpacity>
  );
};

interface NewBillButtonProps {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<AppRootStackParamList, 'Home', undefined>,
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'HomeStackNavigator', undefined>,
      NativeStackNavigationProp<HomeStackParamList, 'Home', undefined>
    >
  >;
}

const NewBillButton: React.FunctionComponent<NewBillButtonProps> = ({
  navigation,
}) => {
  return (
    <Pressable
      alignItems="center"
      backgroundColor="newBillActionStatusBackground"
      borderRadius="lg"
      elevation={1}
      flexBasis="48%"
      flexDirection="row"
      flexGrow={1}
      gap="4"
      justifyContent="center"
      padding="4"
      shadowColor="black"
      shadowOffset={{
        width: 0.1,
        height: 0.1,
      }}
      shadowOpacity={0.2}
      shadowRadius={0.3}
      onPress={() => {
        navigation.navigate('Bill Details');
      }}
    >
      <NewBillSmallIcon />
    </Pressable>
  );
};

interface ActionStatusCountsProps {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<AppRootStackParamList, 'Home', undefined>,
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'HomeStackNavigator', undefined>,
      NativeStackNavigationProp<HomeStackParamList, 'Home', undefined>
    >
  >;
}

export const ActionStatusCounts: React.FunctionComponent<
  ActionStatusCountsProps
> = ({ navigation }) => {
  const {
    data: statusCounts,
    refetch: refetchStatusCounts,
    isStale: areStatusCountsStale,
    isLoading: areStatusCountsLoading,
  } = useActionStatusCounts();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (areStatusCountsStale) refetchStatusCounts();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areStatusCountsStale]);

  const statusCountsObject = React.useMemo(() => {
    if (!statusCounts || statusCounts.length < 1) return {};

    type StatusType = (typeof statusCounts)[number]['status'];

    const result: Partial<{ [key in StatusType]: number }> = {};
    statusCounts.forEach(({ status, count }) => {
      result[status] = count;
    });

    return result;
  }, [statusCounts]);

  const { overdue, pending, ongoing } = statusCountsObject;

  return (
    <>
      <Box
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
        marginBottom="4"
        rowGap="4"
      >
        <Text color="textLight" variant="sm">
          Here's a summary of your bills.
        </Text>

        <CraftedLogoSmall />
      </Box>

      <Box flexDirection="row" flexWrap="wrap" gap="3" marginBottom="10">
        <ActionStatusButton
          count={overdue ?? 0}
          disabled={!overdue}
          icon={OverdueIcon}
          isLoading={areStatusCountsLoading}
          navigation={navigation}
          status="Overdue"
        />
        <ActionStatusButton
          count={pending ?? 0}
          disabled={!pending}
          icon={PendingIcon}
          isLoading={areStatusCountsLoading}
          navigation={navigation}
          status="Pending"
        />

        <ActionStatusButton
          count={ongoing ?? 0}
          disabled={!ongoing}
          icon={RecurringIcon}
          isLoading={areStatusCountsLoading}
          navigation={navigation}
          status="Recurring"
        />

        <NewBillButton navigation={navigation} />
      </Box>
    </>
  );
};
