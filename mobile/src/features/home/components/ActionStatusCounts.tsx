import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { ISvgProps } from 'svg.types';

import { Text } from '@/components';
import { useButtonAnimation } from '@/hooks';
import {
  HalverTiny as HalverTinyIcon,
  NewBillSmall as NewBillSmallIcon,
  Overdue as OverdueIcon,
  Pending as PendingIcon,
  Recurring as RecurringIcon,
} from '@/icons';
import { AppRootStackParamList } from '@/navigation';
import { gapStyles } from '@/theme';
import { cn, isAndroid } from '@/utils';

import { useActionStatusCounts } from '../api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const actionStatusColors = {
  Pending: 'bg-orange-light-200',
  Overdue: 'bg-red-light-200',
  Recurring: 'bg-green-light-200',
};

interface ActionStatusButtonProps {
  count: number;
  icon: React.FunctionComponent<ISvgProps>;
  navigation: NativeStackNavigationProp<AppRootStackParamList, 'Home'>;
  status: string;
  disabled: boolean;
}

const ActionStatusButton: React.FunctionComponent<ActionStatusButtonProps> = ({
  count,
  disabled,
  icon: Icon,
  navigation,
  status,
}) => {
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation({
    disabled,
  });

  return (
    <AnimatedPressable
      className={cn(
        'flex-grow basis-[48.2%] flex-row justify-between rounded-lg p-4',
        actionStatusColors[status],
        'dark:bg-grey-dark-200',
      )}
      disabled={disabled}
      style={[gapStyles[16], animatedStyle]}
      onPress={() => navigation.navigate('Bills By Status', { status })}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Text>
        <Text variant="xl" weight="bold">
          {count}
          {'\n'}
        </Text>
        <Text
          className={cn(isAndroid() ? 'leading-[20px]' : 'leading-[16px]')}
          color="lighter"
          variant="xs"
        >
          {status}
        </Text>
      </Text>

      <Icon />
    </AnimatedPressable>
  );
};

interface NewBillButtonProps {
  navigation: NativeStackNavigationProp<AppRootStackParamList, 'Home'>;
}

const NewBillButton: React.FunctionComponent<NewBillButtonProps> = ({ navigation }) => {
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation();

  return (
    <AnimatedPressable
      className="flex-grow basis-[48.2%] items-center justify-center rounded-lg bg-apricot-50 p-4 dark:bg-grey-dark-200"
      style={[gapStyles[16], animatedStyle]}
      onPress={() => {
        navigation.push('Bill Details');
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <NewBillSmallIcon />
    </AnimatedPressable>
  );
};

// const sample = [
//   {
//     status: 'pending',
//     count: 3,
//   },
//   {
//     status: 'overdue',
//     count: 1,
//   },
//   {
//     status: 'ongoing',
//     count: 7,
//   },
//   {
//     status: 'pending_transfer',
//     count: 2,
//   },
// ];

interface ActionStatusCountsProps {
  navigation: NativeStackNavigationProp<AppRootStackParamList, 'Home'>;
}

export const ActionStatusCounts: React.FunctionComponent<ActionStatusCountsProps> = ({
  navigation,
}) => {
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

  const { overdue, pending, ongoing } = statusCountsObject;

  return (
    <>
      <View className="mb-4 flex-row items-center justify-between">
        <Text color="light" variant="sm">
          Here's a summary of your bills.
        </Text>

        <HalverTinyIcon />
      </View>

      <View className="mb-10 flex-row flex-wrap" style={gapStyles[12]}>
        <ActionStatusButton
          count={overdue ?? 0}
          disabled={!overdue}
          icon={OverdueIcon}
          navigation={navigation}
          status="Overdue"
        />
        <ActionStatusButton
          count={pending ?? 0}
          disabled={!pending}
          icon={PendingIcon}
          navigation={navigation}
          status="Pending"
        />

        <ActionStatusButton
          count={ongoing ?? 0}
          disabled={!ongoing}
          icon={RecurringIcon}
          navigation={navigation}
          status="Recurring"
        />

        <NewBillButton navigation={navigation} />
      </View>
    </>
  );
};
