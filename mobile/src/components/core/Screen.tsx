import { useNavigation, useRoute } from '@react-navigation/native';
import { BoxProps, useTheme } from '@shopify/restyle';
import * as React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserDetails } from '@/features/account/api';
import { Back as BackIcon } from '@/icons';
import { Theme } from '@/lib/restyle';
import { isIOS } from '@/utils';

import { Box } from './Box';
import { Text } from './Text';
import { TouchableOpacity } from './TouchableOpacity';

interface ScreenHeaderProps {
  customScreenName?: string;
  isHeaderTextShown?: boolean;
}

const screensWithNoBackButton = ['Home'];
const screensWithLightHeading = [''];

const ScreenHeader: React.FunctionComponent<ScreenHeaderProps> = ({
  customScreenName,
  isHeaderTextShown = true,
}) => {
  const { name } = useRoute();
  const navigation = useNavigation();
  const { data: userDetails } = useUserDetails();

  const peculiarScreenNames = { Home: `Hello ${userDetails?.firstName}` };
  const isScreenNamePeculiar = Object.keys(peculiarScreenNames).includes(name);
  const screenName = isScreenNamePeculiar ? peculiarScreenNames[name] : name;

  const hasBackButton = !screensWithNoBackButton.includes(name);
  const hasLightHeading = screensWithLightHeading.includes(name);

  return (
    <Box
      alignItems="center"
      flexDirection="row"
      gap="4"
      paddingHorizontal="6"
      paddingVertical="4"
    >
      <TouchableOpacity
        hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
        visible={hasBackButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <BackIcon />
      </TouchableOpacity>

      {isHeaderTextShown && (
        <Text
          color={hasLightHeading ? 'textLight' : 'textDefault'}
          fontFamily="Halver-Semibold"
          variant="2xl"
        >
          {customScreenName || screenName}
        </Text>
      )}
    </Box>
  );
};

type ScreenProps = BoxProps<Theme> & {
  children: React.ReactNode;
  customScreenName?: string;
  hasNoIOSBottomInset?: boolean;
  isHeaderShown?: boolean;
  isHeaderTextShown?: boolean;
  isModal?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Screen: React.FunctionComponent<ScreenProps> = ({
  children,
  customScreenName,
  hasNoIOSBottomInset = false, // Added to make sticky buttons sit properly on IOS
  isHeaderShown = true,
  isHeaderTextShown = true,
  isModal = false,
  style,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const { spacing } = useTheme<Theme>();

  return (
    <Box
      backgroundColor="background"
      flex={1}
      style={[
        {
          paddingTop: isModal && isIOS() ? spacing[5] : insets.top,
          paddingBottom: hasNoIOSBottomInset && isIOS() ? undefined : insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      {...props}
    >
      {isHeaderShown && (
        <ScreenHeader
          customScreenName={customScreenName}
          isHeaderTextShown={isHeaderTextShown}
        />
      )}

      {children}
    </Box>
  );
};
