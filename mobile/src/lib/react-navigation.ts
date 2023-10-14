import { createNavigationContainerRef } from '@react-navigation/native';

import { AppRootStackParamList } from '@/navigation';

export const navigationRef =
  createNavigationContainerRef<AppRootStackParamList>();

/**
 * Navigate to a specific route in the application.
 *
 * @param args - Arguments for navigation. These can include the route name and optional parameters.
 * https://reactnavigation.org/docs/navigating-without-navigation-prop/
 * https://stackoverflow.com/a/74859742
 */
export function navigateWithoutNavigationProp<
  RouteName extends keyof AppRootStackParamList,
>(
  ...args: RouteName extends unknown
    ? undefined extends AppRootStackParamList[RouteName]
      ?
          | [screen: RouteName]
          | [screen: RouteName, params: AppRootStackParamList[RouteName]]
      : [screen: RouteName, params: AppRootStackParamList[RouteName]]
    : never
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args);
  }
}
