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
import { DynamicText } from './Text';
import { TouchableOpacity } from './TouchableOpacity';

interface ScreenHeaderProps {
  customBackButtonHandler?: () => void;
  customScreenName?: string;
  isHeaderTextShown?: boolean;
  headerProps?: BoxProps<Theme>;
  rightComponent?: React.ReactNode;
}

const screensWithNoBackButton = ['Home', 'Financials', 'Bills', 'Account'];
const screensWithLightHeading = [''];

const ScreenHeader: React.FunctionComponent<ScreenHeaderProps> = ({
  customBackButtonHandler,
  customScreenName,
  isHeaderTextShown = true,
  headerProps,
  rightComponent,
}) => {
  const { name } = useRoute();
  const navigation = useNavigation();
  const { data: userDetails } = useUserDetails();

  const screenInfo = React.useMemo(() => {
    const peculiarScreenNames = {
      Home: `Hello ${userDetails?.firstName ?? ''}`,
      Financials: 'Select an option',
      Account: 'Your account',
    };

    const isScreenNamePeculiar = peculiarScreenNames[name] !== undefined;
    const screenName = isScreenNamePeculiar ? peculiarScreenNames[name] : name;
    const hasBackButton = !screensWithNoBackButton.includes(name);
    const hasLightHeading = screensWithLightHeading.includes(name);

    return {
      screenName,
      hasBackButton,
      hasLightHeading,
    };
  }, [name, userDetails]);

  const goBack = () => {
    navigation.goBack();
    customBackButtonHandler?.();
  };

  return (
    <Box
      alignItems="center"
      flexDirection="row"
      gap="2"
      justifyContent="space-between"
      paddingBottom="4"
      paddingHorizontal="6"
      paddingTop="6"
      {...headerProps}
    >
      <Box
        alignItems="center"
        flexDirection="row"
        gap="4"
        maxWidth={rightComponent ? '60%' : '85%'}
      >
        {screenInfo.hasBackButton && (
          <TouchableOpacity
            hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
            visible={screenInfo.hasBackButton}
            onPress={goBack}
          >
            <BackIcon />
          </TouchableOpacity>
        )}

        {isHeaderTextShown && (
          <DynamicText
            color={screenInfo.hasLightHeading ? 'textLight' : 'textDefault'}
            fontFamily="Halver-Semibold"
            lineHeight={29}
            maxWidth="100%"
            numberOfLines={1}
            variant="2xl"
          >
            {customScreenName || screenInfo.screenName}
          </DynamicText>
        )}
      </Box>

      {rightComponent}
    </Box>
  );
};

type ScreenProps = BoxProps<Theme> & {
  children: React.ReactNode;
  customBackButtonHandler?: () => void;
  customScreenName?: string;
  hasNoIOSBottomInset?: boolean;
  headerProps?: BoxProps<Theme>;
  headerRightComponent?: React.ReactNode;
  isHeaderShown?: boolean;
  isHeaderTextShown?: boolean;
  isModal?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Screen: React.FunctionComponent<ScreenProps> = ({
  children,
  customBackButtonHandler,
  customScreenName,
  hasNoIOSBottomInset = true, // Added to make sticky buttons sit properly on IOS
  headerProps,
  headerRightComponent,
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
          paddingTop: isModal && isIOS() ? spacing[4] : insets.top,
          paddingBottom:
            hasNoIOSBottomInset && isIOS() ? undefined : insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      {...props}
    >
      {isHeaderShown && (
        <ScreenHeader
          customBackButtonHandler={customBackButtonHandler}
          customScreenName={customScreenName}
          headerProps={headerProps}
          isHeaderTextShown={isHeaderTextShown}
          rightComponent={headerRightComponent}
        />
      )}

      {children}
    </Box>
  );
};
