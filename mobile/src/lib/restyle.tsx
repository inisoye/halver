import { createTheme, ThemeProvider } from '@shopify/restyle';
import * as React from 'react';
import { useColorScheme } from 'react-native';

const brandColors = {
  apricot1: '#FEF5F3',
  apricot2: '#FCE9E6',
  apricot3: '#F8D1CA',
  apricot4: '#F5B9AF',
  apricot5: '#F1A294',
  apricot6: '#EE8A79',
  apricot7: '#EC7E6B',
  apricot8: '#EB725E',
  apricot9: '#E96650',
  apricot10: '#E75B43',
  apricot11: '#E6553C',

  casal1: '#EFF6F7',
  casal2: '#DBEAED',
  casal3: '#B1D3D9',
  casal4: '#88BCC5',
  casal5: '#5FA5B1',
  casal6: '#45838E',
  casal7: '#315D65',
  casal8: '#2A5057',
  casal9: '#24444A',
  casal10: '#1D373C',
  casal11: '#1A3135',

  goldDrop1: '#FFFAF0',
  goldDrop2: '#FFEED2',
  goldDrop3: '#FFD895',
  goldDrop4: '#FFC157',
  goldDrop5: '#FFAB1A',
  goldDrop6: '#DC8B00',
  goldDrop7: '#B37100',
  goldDrop8: '#8A5700',
  goldDrop9: '#623E00',
  goldDrop10: '#392400',
  goldDrop11: '#241700',

  pharlap1: '#F0EBEB',
  pharlap2: '#E7DFE0',
  pharlap3: '#D5C8C9',
  pharlap4: '#C3B1B2',
  pharlap5: '#B29A9C',
  pharlap6: '#A08385',
  pharlap7: '#916F71',
  pharlap8: '#7C5F61',
  pharlap9: '#685051',
  pharlap10: '#544042',
  pharlap11: '#4A393A',
};

const neutralColors = {
  black: '#000000',
  white: '#ffffff',
  blackish: '#0D0D0D',
  greenNight: '#080F0B',
  transparent: 'transparent',
};

export const lightColors = {
  gray1: 'hsl(0, 0%, 99.0%)',
  gray2: 'hsl(0, 0%, 97.3%)',
  gray3: 'hsl(0, 0%, 95.1%)',
  gray4: 'hsl(0, 0%, 93.0%)',
  gray5: 'hsl(0, 0%, 90.9%)',
  gray6: 'hsl(0, 0%, 88.7%)',
  gray7: 'hsl(0, 0%, 85.8%)',
  gray8: 'hsl(0, 0%, 78.0%)',
  gray9: 'hsl(0, 0%, 56.1%)',
  gray10: 'hsl(0, 0%, 52.3%)',
  gray11: 'hsl(0, 0%, 43.5%)',
  gray12: 'hsl(0, 0%, 9.0%)',

  grayA1: 'hsla(0, 0%, 0%, 0.012)',
  grayA2: 'hsla(0, 0%, 0%, 0.027)',
  grayA3: 'hsla(0, 0%, 0%, 0.047)',
  grayA4: 'hsla(0, 0%, 0%, 0.071)',
  grayA5: 'hsla(0, 0%, 0%, 0.090)',
  grayA6: 'hsla(0, 0%, 0%, 0.114)',
  grayA7: 'hsla(0, 0%, 0%, 0.141)',
  grayA8: 'hsla(0, 0%, 0%, 0.220)',
  grayA9: 'hsla(0, 0%, 0%, 0.439)',
  grayA10: 'hsla(0, 0%, 0%, 0.478)',
  grayA11: 'hsla(0, 0%, 0%, 0.565)',
  grayA12: 'hsla(0, 0%, 0%, 0.910)',

  green1: 'hsl(136, 50.0%, 98.9%)',
  green2: 'hsl(138, 62.5%, 96.9%)',
  green3: 'hsl(139, 55.2%, 94.5%)',
  green4: 'hsl(140, 48.7%, 91.0%)',
  green5: 'hsl(141, 43.7%, 86.0%)',
  green6: 'hsl(143, 40.3%, 79.0%)',
  green7: 'hsl(146, 38.5%, 69.0%)',
  green8: 'hsl(151, 40.2%, 54.1%)',
  green9: 'hsl(151, 55.0%, 41.5%)',
  green10: 'hsl(152, 57.5%, 37.6%)',
  green11: 'hsl(153, 67.0%, 28.5%)',
  green12: 'hsl(155, 40.0%, 14.0%)',

  mainBgLight: '#eeedee',

  orange1: 'hsl(24, 70.0%, 99.0%)',
  orange2: 'hsl(24, 83.3%, 97.6%)',
  orange3: 'hsl(24, 100%, 95.3%)',
  orange4: 'hsl(25, 100%, 92.2%)',
  orange5: 'hsl(25, 100%, 88.2%)',
  orange6: 'hsl(25, 100%, 82.8%)',
  orange7: 'hsl(24, 100%, 75.3%)',
  orange8: 'hsl(24, 94.5%, 64.3%)',
  orange9: 'hsl(24, 94.0%, 50.0%)',
  orange10: 'hsl(24, 100%, 46.5%)',
  orange11: 'hsl(24, 100%, 37.0%)',
  orange12: 'hsl(15, 60.0%, 17.0%)',

  red1: 'hsl(359, 100%, 99.4%)',
  red2: 'hsl(359, 100%, 98.6%)',
  red3: 'hsl(360, 100%, 96.8%)',
  red4: 'hsl(360, 97.9%, 94.8%)',
  red5: 'hsl(360, 90.2%, 91.9%)',
  red6: 'hsl(360, 81.7%, 87.8%)',
  red7: 'hsl(359, 74.2%, 81.7%)',
  red8: 'hsl(359, 69.5%, 74.3%)',
  red9: 'hsl(358, 75.0%, 59.0%)',
  red10: 'hsl(358, 69.4%, 55.2%)',
  red11: 'hsl(358, 65.0%, 48.7%)',
  red12: 'hsl(354, 50.0%, 14.6%)',

  crimson1: 'hsl(332, 100%, 99.4%)',
  crimson2: 'hsl(330, 100%, 98.4%)',
  crimson3: 'hsl(331, 85.6%, 96.6%)',
  crimson4: 'hsl(331, 78.1%, 94.2%)',
  crimson5: 'hsl(332, 72.1%, 91.1%)',
  crimson6: 'hsl(333, 67.0%, 86.7%)',
  crimson7: 'hsl(335, 63.5%, 80.4%)',
  crimson8: 'hsl(336, 62.3%, 72.9%)',
  crimson9: 'hsl(336, 80.0%, 57.8%)',
  crimson10: 'hsl(336, 73.7%, 53.5%)',
  crimson11: 'hsl(336, 75.0%, 47.2%)',
  crimson12: 'hsl(340, 65.0%, 14.5%)',

  amber1: 'hsl(39, 70.0%, 99.0%)',
  amber2: 'hsl(40, 100%, 96.5%)',
  amber3: 'hsl(44, 100%, 91.7%)',
  amber4: 'hsl(43, 100%, 86.8%)',
  amber5: 'hsl(42, 100%, 81.8%)',
  amber6: 'hsl(38, 99.7%, 76.3%)',
  amber7: 'hsl(36, 86.1%, 67.1%)',
  amber8: 'hsl(35, 85.2%, 55.1%)',
  amber9: 'hsl(39, 100%, 57.0%)',
  amber10: 'hsl(35, 100%, 55.5%)',
  amber11: 'hsl(30, 100%, 34.0%)',
  amber12: 'hsl(20, 80.0%, 17.0%)',

  tomato1: 'hsl(10, 100%, 99.4%)',
  tomato2: 'hsl(8, 100%, 98.4%)',
  tomato3: 'hsl(8, 100%, 96.6%)',
  tomato4: 'hsl(8, 100%, 94.3%)',
  tomato5: 'hsl(8, 92.8%, 91.0%)',
  tomato6: 'hsl(9, 84.7%, 86.3%)',
  tomato7: 'hsl(10, 77.3%, 79.5%)',
  tomato8: 'hsl(10, 71.6%, 71.0%)',
  tomato9: 'hsl(10, 78.0%, 54.0%)',
  tomato10: 'hsl(10, 71.5%, 50.0%)',
  tomato11: 'hsl(10, 82.0%, 43.5%)',
  tomato12: 'hsl(10, 50.0%, 13.5%)',
};

export const darkColors = {
  gray1: 'hsl(0, 0%, 8.5%)',
  gray2: 'hsl(0, 0%, 11.0%)',
  gray3: 'hsl(0, 0%, 13.6%)',
  gray4: 'hsl(0, 0%, 15.8%)',
  gray5: 'hsl(0, 0%, 17.9%)',
  gray6: 'hsl(0, 0%, 20.5%)',
  gray7: 'hsl(0, 0%, 24.3%)',
  gray8: 'hsl(0, 0%, 31.2%)',
  gray9: 'hsl(0, 0%, 43.9%)',
  gray10: 'hsl(0, 0%, 49.4%)',
  gray11: 'hsl(0, 0%, 62.8%)',
  gray12: 'hsl(0, 0%, 93.0%)',

  grayA1: 'hsla(0, 0%, 100%, 0)',
  grayA2: 'hsla(0, 0%, 100%, 0.026)',
  grayA3: 'hsla(0, 0%, 100%, 0.056)',
  grayA4: 'hsla(0, 0%, 100%, 0.077)',
  grayA5: 'hsla(0, 0%, 100%, 0.103)',
  grayA6: 'hsla(0, 0%, 100%, 0.129)',
  grayA7: 'hsla(0, 0%, 100%, 0.172)',
  grayA8: 'hsla(0, 0%, 100%, 0.249)',
  grayA9: 'hsla(0, 0%, 100%, 0.386)',
  grayA10: 'hsla(0, 0%, 100%, 0.446)',
  grayA11: 'hsla(0, 0%, 100%, 0.592)',
  grayA12: 'hsla(0, 0%, 100%, 0.923)',

  green1: 'hsl(146, 30.0%, 7.4%)',
  green2: 'hsl(155, 44.2%, 8.4%)',
  green3: 'hsl(155, 46.7%, 10.9%)',
  green4: 'hsl(154, 48.4%, 12.9%)',
  green5: 'hsl(154, 49.7%, 14.9%)',
  green6: 'hsl(154, 50.9%, 17.6%)',
  green7: 'hsl(153, 51.8%, 21.8%)',
  green8: 'hsl(151, 51.7%, 28.4%)',
  green9: 'hsl(151, 55.0%, 41.5%)',
  green10: 'hsl(151, 49.3%, 46.5%)',
  green11: 'hsl(151, 50.0%, 53.2%)',
  green12: 'hsl(137, 72.0%, 94.0%)',

  orange1: 'hsl(30, 70.0%, 7.2%)',
  orange2: 'hsl(28, 100%, 8.4%)',
  orange3: 'hsl(26, 91.1%, 11.6%)',
  orange4: 'hsl(25, 88.3%, 14.1%)',
  orange5: 'hsl(24, 87.6%, 16.6%)',
  orange6: 'hsl(24, 88.6%, 19.8%)',
  orange7: 'hsl(24, 92.4%, 24.0%)',
  orange8: 'hsl(25, 100%, 29.0%)',
  orange9: 'hsl(24, 94.0%, 50.0%)',
  orange10: 'hsl(24, 100%, 58.5%)',
  orange11: 'hsl(24, 100%, 62.2%)',
  orange12: 'hsl(24, 97.0%, 93.2%)',

  red1: 'hsl(353, 23.0%, 9.8%)',
  red2: 'hsl(357, 34.4%, 12.0%)',
  red3: 'hsl(356, 43.4%, 16.4%)',
  red4: 'hsl(356, 47.6%, 19.2%)',
  red5: 'hsl(356, 51.1%, 21.9%)',
  red6: 'hsl(356, 55.2%, 25.9%)',
  red7: 'hsl(357, 60.2%, 31.8%)',
  red8: 'hsl(358, 65.0%, 40.4%)',
  red9: 'hsl(358, 75.0%, 59.0%)',
  red10: 'hsl(358, 85.3%, 64.0%)',
  red11: 'hsl(358, 100%, 69.5%)',
  red12: 'hsl(351, 89.0%, 96.0%)',

  crimson1: 'hsl(335, 20.0%, 9.6%)',
  crimson2: 'hsl(335, 32.2%, 11.6%)',
  crimson3: 'hsl(335, 42.5%, 16.5%)',
  crimson4: 'hsl(335, 47.2%, 19.3%)',
  crimson5: 'hsl(335, 50.9%, 21.8%)',
  crimson6: 'hsl(335, 55.7%, 25.3%)',
  crimson7: 'hsl(336, 62.9%, 30.8%)',
  crimson8: 'hsl(336, 74.9%, 39.0%)',
  crimson9: 'hsl(336, 80.0%, 57.8%)',
  crimson10: 'hsl(339, 84.1%, 62.6%)',
  crimson11: 'hsl(341, 90.0%, 67.3%)',
  crimson12: 'hsl(332, 87.0%, 96.0%)',

  amber1: 'hsl(36, 100%, 6.1%)',
  amber2: 'hsl(35, 100%, 7.6%)',
  amber3: 'hsl(32, 100%, 10.2%)',
  amber4: 'hsl(32, 100%, 12.4%)',
  amber5: 'hsl(33, 100%, 14.6%)',
  amber6: 'hsl(35, 100%, 17.1%)',
  amber7: 'hsl(35, 91.0%, 21.6%)',
  amber8: 'hsl(36, 100%, 25.5%)',
  amber9: 'hsl(39, 100%, 57.0%)',
  amber10: 'hsl(43, 100%, 64.0%)',
  amber11: 'hsl(39, 90.0%, 49.8%)',
  amber12: 'hsl(39, 97.0%, 93.2%)',

  tomato1: 'hsl(10, 23.0%, 9.4%)',
  tomato2: 'hsl(9, 44.8%, 11.4%)',
  tomato3: 'hsl(8, 52.0%, 15.3%)',
  tomato4: 'hsl(7, 56.3%, 18.0%)',
  tomato5: 'hsl(7, 60.1%, 20.6%)',
  tomato6: 'hsl(8, 64.8%, 24.0%)',
  tomato7: 'hsl(8, 71.2%, 29.1%)',
  tomato8: 'hsl(10, 80.2%, 35.7%)',
  tomato9: 'hsl(10, 78.0%, 54.0%)',
  tomato10: 'hsl(10, 81.7%, 59.0%)',
  tomato11: 'hsl(10, 85.0%, 62.8%)',
  tomato12: 'hsl(10, 89.0%, 96.0%)',
};

export const tailwindSpacing = {
  auto: 'auto',
  '0': 0,
  px: 1,
  'px.5': 1.5,
  '0.5': 2,
  '0.75': 3,
  '1': 4,
  '1.5': 6,
  '-2': -8,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
  '11': 44,
  '12': 48,
  '14': 56,
  '16': 64,
  '20': 80,
  '24': 96,
  '28': 112,
  '32': 128,
  '36': 144,
  '40': 160,
  '44': 176,
  '48': 192,
  '52': 208,
  '56': 224,
  '60': 240,
  '64': 256,
  '72': 288,
  '80': 320,
  '96': 384,
};

const theme = createTheme({
  colors: {
    ...brandColors,
    ...neutralColors,
    ...lightColors,

    background: lightColors.mainBgLight,
    darkBackground: darkColors.gray1,
    lightBackground: lightColors.mainBgLight,
    elementBackground: lightColors.gray2,

    textDefault: lightColors.gray12,
    textInverse: lightColors.gray1,
    textWhite: lightColors.gray1,
    textBlack: lightColors.gray12,
    textLight: lightColors.gray11,
    textLighter: lightColors.gray10,

    textIntroMarqueeDark: lightColors.gray1,
    textIntroMarqueeLight: darkColors.gray3,

    bottomTabText: lightColors.gray9,

    buttonApricot: brandColors.apricot7,
    buttonCasal: brandColors.casal7,
    buttonPharlap: brandColors.pharlap7,
    buttonNeutral: lightColors.gray2,
    buttonNeutralDarker: lightColors.gray5,

    buttonTextApricot: lightColors.gray1,
    buttonTextCasal: lightColors.gray1,
    buttonTextPharlap: lightColors.gray1,
    buttonTextNeutral: lightColors.gray12,

    radioButtonBackgroundDefault: lightColors.gray1,
    radioButtonBackgroundSelected: brandColors.apricot8,

    imageBackground: neutralColors.white,
    missingImageBackground: lightColors.gray7,

    inputBackground: lightColors.gray2,
    inputBackgroundDarker: lightColors.gray4,
    inputText: lightColors.gray12,
    inputErrorBackground: darkColors.red8,
    inputPlaceholder: lightColors.grayA8,

    inputNestedButtonBackground: lightColors.gray5,

    modalBackground: lightColors.gray2,
    modalElementBackground: lightColors.gray4,
    modalOverlay: lightColors.grayA10,
    modalFilterContainerBorder: lightColors.gray7,

    successModalBackground: lightColors.green3,
    successModalHeadingBackground: lightColors.green1,

    pendingActionStatusBackground: lightColors.orange3,
    overdueActionStatusBackground: lightColors.red3,
    recurringActionStatusBackground: lightColors.green3,
    newBillActionStatusBackground: brandColors.apricot1,

    selectedItemBackground: lightColors.green5,

    bankImageBackground: lightColors.gray7,

    webViewBackground: neutralColors.white,

    datePickerMarkBackground: lightColors.gray4,
    datePickerCategoryLabelText: lightColors.gray10,

    logoApricot: brandColors.apricot6,
    logoCasal: brandColors.casal7,
  },
  spacing: tailwindSpacing,
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  borderRadii: {
    none: 0,
    sm: 2,
    base: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
  },
  zIndices: {
    '-20': -20,
    '-10': -10,
    '0': 0,
    '10': 10,
    '20': 20,
    '30': 30,
    '40': 40,
    '50': 50,
  },
  textVariants: {
    defaults: {
      fontFamily: 'Halver-Medium',
      fontSize: 16,
      color: 'textDefault',
      letterSpacing: -0.1,
    },
    xxs: {
      fontSize: 10,
      lineHeight: 12,
    },
    xs: {
      fontSize: 12,
      lineHeight: 15,
    },
    sm: {
      fontSize: 14,
      lineHeight: 18,
    },
    lg: {
      fontSize: 18,
      lineHeight: 26,
    },
    xl: {
      fontSize: 20,
      lineHeight: 24,
      letterSpacing: -0.65,
    },
    '2xl': {
      fontSize: 24,
      lineHeight: 28,
      letterSpacing: -0.8,
    },
    '3xl': {
      fontSize: 28,
      lineHeight: 42,
      letterSpacing: -0.8,
    },
    '4xl': {
      fontSize: 32,
      lineHeight: 48,
      letterSpacing: -1.3,
    },
  },
  buttonVariants: {
    defaults: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 'base',
      paddingHorizontal: '6',
      paddingVertical: '3',
    },
    sm: {
      paddingHorizontal: '4',
      paddingVertical: '2',
      fontSize: 14,
    },
    xs: {
      paddingHorizontal: '3',
      paddingVertical: '1.5',
    },
    xxs: {
      paddingHorizontal: '2',
      paddingVertical: '1',
    },
  },
  cardVariants: {
    defaults: {
      backgroundColor: 'elementBackground',
      borderRadius: 'lg',
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,

      elevation: 1,
    },
  },
});

export type Theme = typeof theme;

const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    ...darkColors,

    background: darkColors.gray1,
    elementBackground: darkColors.gray3,

    textDefault: darkColors.gray12,
    textInverse: darkColors.gray1,
    textWhite: darkColors.gray12,
    textBlack: darkColors.gray1,
    textLight: darkColors.gray11,
    textLighter: darkColors.gray10,

    bottomTabText: darkColors.gray9,

    buttonApricot: brandColors.apricot6,
    buttonCasal: brandColors.casal7,
    buttonPharlap: brandColors.pharlap6,
    buttonNeutral: darkColors.gray3,
    buttonNeutralDarker: darkColors.gray3,

    buttonTextApricot: darkColors.gray1,
    buttonTextCasal: darkColors.gray12,
    buttonTextPharlap: darkColors.gray1,
    buttonTextNeutral: darkColors.gray12,

    radioButtonBackgroundDefault: darkColors.gray4,
    radioButtonBackgroundSelected: brandColors.apricot6,

    imageBackground: neutralColors.white,
    missingImageBackground: darkColors.gray12,

    inputBackground: darkColors.gray3,
    inputBackgroundDarker: darkColors.gray3,
    inputText: darkColors.gray12,
    inputErrorBackground: darkColors.red7,
    inputPlaceholder: darkColors.grayA8,

    inputNestedButtonBackground: darkColors.gray5,

    modalBackground: darkColors.gray2,
    modalElementBackground: darkColors.gray3,
    modalFilterContainerBorder: darkColors.gray5,

    successModalBackground: darkColors.green3,
    successModalHeadingBackground: darkColors.green1,

    pendingActionStatusBackground: darkColors.gray3,
    overdueActionStatusBackground: darkColors.gray3,
    recurringActionStatusBackground: darkColors.gray3,
    newBillActionStatusBackground: darkColors.gray3,

    selectedItemBackground: darkColors.green3,

    bankImageBackground: darkColors.gray12,

    webViewBackground: darkColors.gray12,

    datePickerMarkBackground: darkColors.gray3,
    datePickerCategoryLabelText: darkColors.gray10,

    logoApricot: brandColors.apricot8,
    logoCasal: brandColors.casal8,
  },
};

interface RestyleProviderProps {
  children: React.ReactNode;
}

export const RestyleProvider: React.FunctionComponent<RestyleProviderProps> = ({
  children,
}) => {
  const scheme = useColorScheme();

  return (
    <ThemeProvider theme={scheme === 'dark' ? darkTheme : theme}>
      {children}
    </ThemeProvider>
  );
};
