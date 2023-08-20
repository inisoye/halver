import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@shopify/restyle';
import * as React from 'react';

import { Text } from '@/components';
import {
  Account as AccountIcon,
  Bills as BillsIcon,
  Home as HomeIcon,
  NewBill as NewBillIcon,
  Transactions as TransactionsIcon,
} from '@/icons';
import { Theme } from '@/lib/restyle';
import {
  AccountStackNavigator,
  BillsStackNavigator,
  FinancialsStackNavigator,
  HomeStackNavigator,
} from '@/navigation/stacks';
import { BillDetailsPlaceholder } from '@/screens';
import { isIOS } from '@/utils';

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
  FinancialsStackNavigator: { screen: string };
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
    name: 'FinancialsStackNavigator',
    component: FinancialsStackNavigator,
    label: 'Financials',
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
  const { colors } = useTheme<Theme>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          flex: isIOS() ? 0.07 : 0.08,
          elevation: 0,
          backgroundColor: colors.bottomTabBackground,
          borderTopColor: colors.bottomTabBorder,
        },
        tabBarItemStyle: {
          height: 46,
          flexDirection: 'column',
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
                marginTop: isMiddleItem ? 6 : 0,
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
