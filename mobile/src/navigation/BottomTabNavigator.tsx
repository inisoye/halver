import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Platform, useColorScheme } from 'react-native';

import { Text } from '@/components';
import {
  Account as AccountIcon,
  Bills as BillsIcon,
  Home as HomeIcon,
  NewBill as NewBillIcon,
  Transactions as TransactionsIcon,
} from '@/icons';
import { BillAmount } from '@/screens';
import { colors } from '@/theme';
import { cn } from '@/utils';

import {
  AccountStackNavigator,
  BillsStackNavigator,
  HomeStackNavigator,
  TransactionsStackNavigator,
} from './stacks';

interface BottomTabTextProps {
  label: string | undefined;
  focused: boolean;
  isMiddleItem: boolean;
}

export const BottomTabText: React.FunctionComponent<BottomTabTextProps> = ({
  label,
  focused,
  isMiddleItem,
}) => {
  return (
    <Text
      variant="xxs"
      className={cn(
        'text-grey-light-950 dark:text-grey-dark-950',
        focused && 'text-grey-light-1000 dark:text-grey-dark-1000',
        isMiddleItem && 'hidden',
      )}
    >
      {label}
    </Text>
  );
};

export type TabParamList = {
  HomeStackNavigator: undefined;
  BillsStackNavigator: undefined;
  'Bill Amount': undefined;
  TransactionsStackNavigator: undefined;
  AccountStackNavigator: undefined;
};

type TabType = {
  name: keyof TabParamList;
  component: React.FunctionComponent;
  label: string;
  icon: React.FunctionComponent;
};

const tabs: TabType[] = [
  {
    name: 'HomeStackNavigator',
    component: HomeStackNavigator,
    label: 'Home',
    icon: HomeIcon,
  },
  {
    name: 'BillsStackNavigator',
    component: BillsStackNavigator,
    label: 'Bills',
    icon: BillsIcon,
  },
  {
    name: 'Bill Amount',
    component: BillAmount as React.FunctionComponent,
    label: 'BillAmount',
    icon: NewBillIcon,
  },
  {
    name: 'TransactionsStackNavigator',
    component: TransactionsStackNavigator,
    label: 'Transactions',
    icon: TransactionsIcon,
  },
  {
    name: 'AccountStackNavigator',
    component: AccountStackNavigator,
    label: 'Account',
    icon: AccountIcon,
  },
];

const Tab = createBottomTabNavigator<TabParamList>();

export const BottomTabNavigator = () => {
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          headerShown: false,
          tabBarStyle: {
            flex: Platform.OS === 'ios' ? 0.08 : 0.09,
            elevation: 0,
            backgroundColor: isDarkMode ? colors['grey-dark'][50] : '#E4E2E4',
            borderTopColor: isDarkMode ? colors['grey-dark'][600] : colors['grey-light'][700],
            display: route.name === 'Bill Amount' ? 'none' : 'flex',
          },
          tabBarItemStyle: {
            height: 46,
            flexDirection: 'column',
          },
          tabBarLabelStyle: {
            color: isDarkMode ? colors['grey-dark'][1000] : colors['grey-light'][1000],
          },
        };
      }}
    >
      {tabs.map(({ name, component, label, icon }, index) => {
        const isMiddleItem = index === 2;

        return (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              title: label,
              tabBarIconStyle: {
                marginTop: isMiddleItem ? 6 : 0,
              },
              tabBarIcon: ({ focused }) => (icon ? icon({ focused }) : undefined),
              tabBarLabel: ({ focused }) => BottomTabText({ label, focused, isMiddleItem }),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};
