import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  AccountStackNavigator,
  BillsStackNavigator,
  HomeStackNavigator,
  NewBillStackNavigator,
  TransactionsStackNavigator
} from "@/navigation";


import type { ComponentType } from 'react';
type TabParamList = {
  HomeStackNavigator: undefined;
  BillsStackNavigator: undefined;
  NewBillStackNavigator: undefined;
  TransactionsStackNavigator: undefined;
  AccountStackNavigator: undefined;
};

type TabType = {
  name: keyof TabParamList;
  component: ComponentType<any>;
  label?: string;
};

const tabs: TabType[] = [
  {
    name: 'HomeStackNavigator',
    component: HomeStackNavigator,
    label: 'Home',
  },
  {
    name: 'BillsStackNavigator',
    component: BillsStackNavigator,
    label: 'Bills',
  },
  {
    name: 'NewBillStackNavigator',
    component: NewBillStackNavigator,
    label: 'New Bill',
  },
  {
    name: 'TransactionsStackNavigator',
    component: TransactionsStackNavigator,
    label: 'Transactions',
  },
  {
    name: 'AccountStackNavigator',
    component: AccountStackNavigator,
    label: 'Account',
  },
];

const Tabs = createBottomTabNavigator<TabParamList>();

export const BottomTabNavigator = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Group
        screenOptions={{
          headerShown: false,
        }}
      >
        {tabs.map(({ name, component, label }) => {
          return (
            <Tabs.Screen
              key={name}
              name={name}
              component={component}
              options={{
                title: label,
              }}
            />
          );
        })}
      </Tabs.Group>
    </Tabs.Navigator>
  );
};
