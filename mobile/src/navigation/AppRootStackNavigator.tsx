import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import type { BillActionStatus } from '@/features/bills';
import {
  AddCard,
  AddTransferRecipient,
  BillDetails,
  BillParticipants,
  BillPayment,
  BillsByStatus,
  BillSummary,
  EditPhoneNumber,
  EditProfileImage,
  SplitBreakdown,
} from '@/screens';

import { BottomTabNavigator } from './BottomTabNavigator';

export type AppRootStackParamList = {
  Home: // Arcane type added mainly for routing routing to bill after creation.
  | {
        screen: string;
        params: {
          screen: string;
          initial: boolean;
          params: {
            id: string;
            name: string;
          };
        };
      }
    | undefined;
  'Bill Details': undefined;
  'Select Participants': undefined;
  'Bills By Status': { status: string };
  'Split Breakdown': undefined;
  'Bill Summary': undefined;
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
  };
  'Add your card': undefined;
  'Add a recipient': undefined;
  'Edit profile image': undefined;
  'Edit phone number': undefined;
};

const AppRootStack = createNativeStackNavigator<AppRootStackParamList>();

export const AppRootStackNavigator: React.FunctionComponent = () => {
  return (
    <AppRootStack.Navigator>
      <AppRootStack.Screen
        component={BottomTabNavigator}
        name="Home"
        options={{ headerShown: false }}
      />

      <AppRootStack.Group screenOptions={{ headerShown: false }}>
        <AppRootStack.Screen component={BillDetails} name="Bill Details" />
        <AppRootStack.Screen component={BillParticipants} name="Select Participants" />
        <AppRootStack.Screen component={SplitBreakdown} name="Split Breakdown" />
        <AppRootStack.Screen component={BillSummary} name="Bill Summary" />
      </AppRootStack.Group>

      <AppRootStack.Group screenOptions={{ headerShown: false }}>
        <AppRootStack.Screen
          component={BillPayment}
          name="Bill Payment"
          options={{
            headerShown: false,
          }}
        />
      </AppRootStack.Group>

      <AppRootStack.Group screenOptions={{ headerShown: false }}>
        <AppRootStack.Screen
          component={EditProfileImage}
          name="Edit profile image"
          options={{
            headerShown: false,
          }}
        />

        <AppRootStack.Screen
          component={EditPhoneNumber}
          name="Edit phone number"
          options={{
            headerShown: false,
          }}
        />
      </AppRootStack.Group>

      <AppRootStack.Group screenOptions={{ headerShown: false }}>
        <AppRootStack.Screen
          component={AddCard}
          name="Add your card"
          options={{
            headerShown: false,
          }}
        />
        <AppRootStack.Screen
          component={AddTransferRecipient}
          name="Add a recipient"
          options={{
            headerShown: false,
          }}
        />
      </AppRootStack.Group>

      <AppRootStack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
        <AppRootStack.Screen component={BillsByStatus} name="Bills By Status" />
      </AppRootStack.Group>
    </AppRootStack.Navigator>
  );
};
