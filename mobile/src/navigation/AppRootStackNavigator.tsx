import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { useStoreExpoPushToken } from '@/features/account';
import type { BillActionStatus } from '@/features/bills';
import { actionStatusColors } from '@/features/home';
import {
  AddCard,
  AddTransferRecipient,
  BillDetails,
  BillParticipants,
  BillPayment,
  BillSummary,
  EditPhoneNumber,
  EditProfileImage,
  SplitBreakdown,
} from '@/screens';

import { BottomTabNavigator } from './BottomTabNavigator';

export type AppRootStackParamList = {
  TabsRoot: // Arcane type added mainly for routing to bill after creation.
  | {
        screen: string;
        params: {
          screen: string;
          initial: boolean;
          params?: {
            id?: string;
            name?: string;
            shouldUpdate?: boolean;
            isOnRoot?: boolean;
          };
        };
      }
    | undefined;

  Home: undefined;

  'Bill Details': undefined;
  'Select Participants': undefined;
  'Split Breakdown': undefined;
  'Bill Summary': undefined;

  Bill: {
    id: string;
    name: string;
    shouldUpdate?: boolean;
    isOnRoot?: boolean;
  };
  'Bills by status': { status: keyof typeof actionStatusColors };
  'Bill Payment': {
    actionId: string | undefined;
    status: BillActionStatus | undefined;
    billId: string;
    contribution: string | null | undefined;
    creditorName: string | undefined;
    deadline: string | null | undefined;
    deductionPattern: string | undefined;
    fee: string | null | undefined;
    firstChargeDate: string | null | undefined;
    name: string;
    isOnRoot?: boolean;
  };
  'Contributions by day': {
    id: string;
    totalAmountDue: number;
    name: string;
    totalAmountPaid: number;
  };
  'Transactions in countribution round': {
    id: string;
    day: string | undefined;
    billName: string;
  };
  'Bill transactions': { id: string; name: string };

  'Edit profile image': undefined;
  'Edit phone number': undefined;
  'Add your card': undefined;
  'Add a recipient': undefined;

  Transactions: undefined;
};

export const AppRootStack = createNativeStackNavigator<AppRootStackParamList>();

export const AppRootStackNavigator: React.FunctionComponent = () => {
  useStoreExpoPushToken();

  return (
    <AppRootStack.Navigator>
      <AppRootStack.Screen
        component={BottomTabNavigator}
        name="TabsRoot"
        options={{ headerShown: false }}
      />

      <AppRootStack.Group screenOptions={{ headerShown: false }}>
        <AppRootStack.Screen component={BillDetails} name="Bill Details" />
        <AppRootStack.Screen
          component={BillParticipants}
          name="Select Participants"
        />
        <AppRootStack.Screen
          component={SplitBreakdown}
          name="Split Breakdown"
        />
        <AppRootStack.Screen component={BillSummary} name="Bill Summary" />
      </AppRootStack.Group>

      <AppRootStack.Group screenOptions={{ headerShown: false }}>
        <AppRootStack.Screen
          component={EditProfileImage}
          name="Edit profile image"
        />
        <AppRootStack.Screen
          component={EditPhoneNumber}
          name="Edit phone number"
        />
        <AppRootStack.Screen component={AddCard} name="Add your card" />
        <AppRootStack.Screen
          component={AddTransferRecipient}
          name="Add a recipient"
        />
      </AppRootStack.Group>

      <AppRootStack.Group screenOptions={{ headerShown: false }}>
        <AppRootStack.Screen component={BillPayment} name="Bill Payment" />
      </AppRootStack.Group>
    </AppRootStack.Navigator>
  );
};
