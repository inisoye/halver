import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { useColorScheme } from 'react-native';

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
import { BillAmountPlaceholder } from '@/screens';
import { colors } from '@/theme';
import { cn, isIOS } from '@/utils';

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
      className={cn(
        'text-grey-light-800 dark:text-grey-dark-800',
        focused && 'text-grey-light-1000 dark:text-grey-dark-1000',
        isMiddleItem && 'hidden',
      )}
      variant="xxs"
      weight="bold"
    >
      {label}
    </Text>
  );
};

export type TabParamList = {
  HomeStackNavigator: undefined;
  BillsStackNavigator: undefined;
  'Bill Amount Placeholder': undefined;
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
    name: 'Bill Amount Placeholder',
    component: BillAmountPlaceholder as React.FunctionComponent,
    label: 'BillAmountPlaceholder',
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
      screenOptions={() => {
        return {
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
            component={component}
            key={name}
            listeners={({ navigation }) => ({
              tabPress: event => {
                if (isMiddleItem) {
                  event.preventDefault();
                  navigation.navigate('Bill Amount');
                }
              },
            })}
            name={name}
            options={{
              title: label,
              tabBarIconStyle: {
                marginTop: isMiddleItem ? 8 : 0,
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
