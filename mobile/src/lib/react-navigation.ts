import { createNavigationContainerRef } from '@react-navigation/native';

import {
  AccountStackParamList,
  AppRootStackParamList,
  BillsStackParamList,
  FinancialsStackParamList,
  HomeStackParamList,
  LoginStackParamList,
  OnboardingStackParamList,
  TabParamList,
} from '@/navigation';

type AllRoutes = AppRootStackParamList &
  TabParamList &
  AccountStackParamList &
  BillsStackParamList &
  FinancialsStackParamList &
  HomeStackParamList &
  LoginStackParamList &
  OnboardingStackParamList;

export const navigationRef = createNavigationContainerRef<AllRoutes>();

/**
 * Navigate to a specific route in the application.
 *
 * @param args - Arguments for navigation. These can include the route name and optional parameters.
 * https://reactnavigation.org/docs/navigating-without-navigation-prop/
 * https://stackoverflow.com/a/74859742
 */
export function navigateWithoutNavigationProp<
  RouteName extends keyof AllRoutes,
>(
  ...args: RouteName extends unknown
    ? undefined extends AllRoutes[RouteName]
      ? [screen: RouteName] | [screen: RouteName, params: AllRoutes[RouteName]]
      : [screen: RouteName, params: AllRoutes[RouteName]]
    : never
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args);
  }
}
