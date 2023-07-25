import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import type { ISvgProps } from 'svg.types';

import { Box, Pressable, Text } from '@/components';
import {
  HalverTiny as HalverTinyIcon,
  NewBillSmall as NewBillSmallIcon,
  Overdue as OverdueIcon,
  Pending as PendingIcon,
  Recurring as RecurringIcon,
} from '@/icons';
import { AppRootStackParamList } from '@/navigation';
import { isAndroid } from '@/utils';

import { useActionStatusCounts } from '../api';

const actionStatusColors = {
  Pending: 'pendingActionStatusBackground',
  Overdue: 'overdueActionStatusBackground',
  Recurring: 'recurringActionStatusBackground',
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
  return (
    <Pressable
      backgroundColor={actionStatusColors[status]}
      borderRadius="lg"
      disabled={disabled}
      elevation={1}
      flexBasis="48.2%"
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
      onPress={() => navigation.navigate('Bills By Status', { status })}
    >
      <Text>
        <Text fontFamily="Halver-Semibold" variant="xl">
          {count}
          {'\n'}
        </Text>

        <Text color="textLighter" lineHeight={isAndroid() ? 20 : 16} variant="xs">
          {status}
        </Text>
      </Text>

      <Icon />
    </Pressable>
  );
};

interface NewBillButtonProps {
  navigation: NativeStackNavigationProp<AppRootStackParamList, 'Home'>;
}

const NewBillButton: React.FunctionComponent<NewBillButtonProps> = ({ navigation }) => {
  return (
    <Pressable
      alignItems="center"
      backgroundColor="newBillActionStatusBackground"
      borderRadius="lg"
      elevation={1}
      flexBasis="48.2%"
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

        <HalverTinyIcon />
      </Box>

      <Box flexDirection="row" flexWrap="wrap" gap="3" marginBottom="10">
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
      </Box>
    </>
  );
};
