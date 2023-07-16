import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import { Text } from '@/components';
import {
  Account as AccountIcon,
  Bills as BillsIcon,
  Home as HomeIcon,
  NewBill as NewBillIcon,
  Transactions as TransactionsIcon,
} from '@/icons';
import {
  AccountStackNavigator,
  BillsStackNavigator,
  HomeStackNavigator,
  TransactionsStackNavigator,
} from '@/navigation/stacks';
import { BillDetailsPlaceholder } from '@/screens';
import { colors } from '@/theme';
import { isIOS, useIsDarkMode } from '@/utils';

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
      color={focused ? 'gray12' : 'gray9'}
      fontFamily="Halver-Semibold"
      variant="xxs"
      visible={!isMiddleItem}
    >
      {label}
    </Text>
  );
};

export type TabParamList = {
  HomeStackNavigator: undefined;
  BillsStackNavigator: undefined;
  BillDetailsPlaceholder: undefined;
  TransactionsStackNavigator: undefined;
  AccountStackNavigator: undefined;
};

type TabType = {
  name: keyof TabParamList;
  component: React.FunctionComponent;
  label: string;
  icon: React.FunctionComponent;
};

export const tabs: TabType[] = [
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
    name: 'BillDetailsPlaceholder',
    component: BillDetailsPlaceholder as React.FunctionComponent,
    label: 'BillDetailsPlaceholder',
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
  const isDarkMode = useIsDarkMode();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          flex: isIOS() ? 0.07 : 0.08,
          elevation: 0,
          backgroundColor: isDarkMode
            ? colors['grey-dark'][50]
            : colors['main-bg-light'],
          borderTopColor: isDarkMode
            ? colors['grey-dark'][600]
            : colors['grey-light'][700],
        },
        tabBarItemStyle: {
          height: 44,
          flexDirection: 'column',
        },
        tabBarLabelStyle: {
          color: isDarkMode ? colors['grey-dark'][1000] : colors['grey-light'][1000],
        },
      }}
    >
      {tabs.map(({ name, component, label, icon }, index) => {
        const isMiddleItem = index === 2;

        return (
          <Tab.Screen
            component={component}
            key={name}
            listeners={({ navigation }) => ({
              tabPress: event => {
                if (isMiddleItem) {
                  event.preventDefault();
                  navigation.navigate('Bill Details');
                }
              },
            })}
            name={name}
            options={{
              title: label,
              tabBarIconStyle: {
                marginTop: isMiddleItem ? 10 : 0,
              },
              tabBarIcon: ({ focused }) => (icon ? icon({ focused }) : undefined),
              tabBarLabel: ({ focused }) =>
                BottomTabText({ label, focused, isMiddleItem }),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};
