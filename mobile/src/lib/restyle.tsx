import { createTheme, ThemeProvider } from '@shopify/restyle';
import * as React from 'react';

import { useIsDarkModeSelected } from '@/utils';

export const brandColors = {
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
  gray1: '#fcfcfc',
  gray2: '#f9f9f9',
  gray3: '#f0f0f0',
  gray4: '#e8e8e8',
  gray5: '#e0e0e0',
  gray6: '#d9d9d9',
  gray7: '#cecece',
  gray8: '#bbbbbb',
  gray9: '#8d8d8d',
  gray10: '#838383',
  gray11: '#646464',
  gray12: '#202020',

  grayA1: '#00000003',
  grayA2: '#00000006',
  grayA3: '#0000000f',
  grayA4: '#00000017',
  grayA5: '#0000001f',
  grayA6: '#00000026',
  grayA7: '#00000031',
  grayA8: '#00000044',
  grayA9: '#00000072',
  grayA10: '#0000007c',
  grayA11: '#0000009b',
  grayA12: '#000000df',

  green1: '#fbfefc',
  green2: '#f4fbf6',
  green3: '#e6f6eb',
  green4: '#d6f1df',
  green5: '#c4e8d1',
  green6: '#adddc0',
  green7: '#8eceaa',
  green8: '#5bb98b',
  green9: '#30a46c',
  green10: '#2b9a66',
  green11: '#218358',
  green12: '#193b2d',

  mainBgLight: '#eeedee',

  orange1: '#fefcfb',
  orange2: '#fff7ed',
  orange3: '#ffefd6',
  orange4: '#ffdfb5',
  orange5: '#ffd19a',
  orange6: '#ffc182',
  orange7: '#f5ae73',
  orange8: '#ec9455',
  orange9: '#f76b15',
  orange10: '#ef5f00',
  orange11: '#cc4e00',
  orange12: '#582d1d',

  red1: '#fffcfc',
  red2: '#fff7f7',
  red3: '#feebec',
  red4: '#ffdbdc',
  red5: '#ffcdce',
  red6: '#fdbdbe',
  red7: '#f4a9aa',
  red8: '#eb8e90',
  red9: '#e5484d',
  red10: '#dc3e42',
  red11: '#ce2c31',
  red12: '#641723',

  crimson1: '#fffcfd',
  crimson2: '#fef7f9',
  crimson3: '#ffe9f0',
  crimson4: '#fedce7',
  crimson5: '#facedd',
  crimson6: '#f3bed1',
  crimson7: '#eaacc3',
  crimson8: '#e093b2',
  crimson9: '#e93d82',
  crimson10: '#df3478',
  crimson11: '#cb1d63',
  crimson12: '#621639',

  amber1: '#fefdfb',
  amber2: '#fefbe9',
  amber3: '#fff7c2',
  amber4: '#ffee9c',
  amber5: '#fbe577',
  amber6: '#f3d673',
  amber7: '#e9c162',
  amber8: '#e2a336',
  amber9: '#ffc53d',
  amber10: '#ffba18',
  amber11: '#ab6400',
  amber12: '#4f3422',

  tomato1: '#fffcfc',
  tomato2: '#fff8f7',
  tomato3: '#feebe7',
  tomato4: '#ffdcd3',
  tomato5: '#ffcdc2',
  tomato6: '#fdbdaf',
  tomato7: '#f5a898',
  tomato8: '#ec8e7b',
  tomato9: '#e54d2e',
  tomato10: '#dd4425',
  tomato11: '#d13415',
  tomato12: '#5c271f',

  brown1: '#fefdfc',
  brown2: '#fcf9f6',
  brown3: '#f6eee7',
  brown4: '#f0e4d9',
  brown5: '#ebdaca',
  brown6: '#e4cdb7',
  brown7: '#dcbc9f',
  brown8: '#cea37e',
  brown9: '#ad7f58',
  brown10: '#a07553',
  brown11: '#815e46',
  brown12: '#3e332e',

  indigo1: '#fdfdfe',
  indigo2: '#f7f9ff',
  indigo3: '#edf2fe',
  indigo4: '#e1e9ff',
  indigo5: '#d2deff',
  indigo6: '#c1d0ff',
  indigo7: '#abbdf9',
  indigo8: '#8da4ef',
  indigo9: '#3e63dd',
  indigo10: '#3358d4',
  indigo11: '#3a5bc7',
  indigo12: '#1f2d5c',

  plum1: '#fefcff',
  plum2: '#fdf7fd',
  plum3: '#fbebfb',
  plum4: '#f7def8',
  plum5: '#f2d1f3',
  plum6: '#e9c2ec',
  plum7: '#deade3',
  plum8: '#cf91d8',
  plum9: '#ab4aba',
  plum10: '#a144af',
  plum11: '#953ea3',
  plum12: '#53195d',

  yellow1: '#fdfdf9',
  yellow2: '#fefce9',
  yellow3: '#fffab8',
  yellow4: '#fff394',
  yellow5: '#ffe770',
  yellow6: '#f3d768',
  yellow7: '#e4c767',
  yellow8: '#d5ae39',
  yellow9: '#ffe629',
  yellow10: '#ffdc00',
  yellow11: '#9e6c00',
  yellow12: '#473b1f',

  iris1: '#fdfdff',
  iris2: '#f8f8ff',
  iris3: '#f0f1fe',
  iris4: '#e6e7ff',
  iris5: '#dadcff',
  iris6: '#cbcdff',
  iris7: '#b8baf8',
  iris8: '#9b9ef0',
  iris9: '#5b5bd6',
  iris10: '#5151cd',
  iris11: '#5753c6',
  iris12: '#272962',

  gold1: '#fdfdfc',
  gold2: '#faf9f2',
  gold3: '#f2f0e7',
  gold4: '#eae6db',
  gold5: '#e1dccf',
  gold6: '#d8d0bf',
  gold7: '#cbc0aa',
  gold8: '#b9a88d',
  gold9: '#978365',
  gold10: '#8c7a5e',
  gold11: '#71624b',
  gold12: '#3b352b',
};

export const darkColors = {
  gray1: '#111111',
  gray2: '#191919',
  gray3: '#222222',
  gray4: '#2a2a2a',
  gray5: '#313131',
  gray6: '#3a3a3a',
  gray7: '#484848',
  gray8: '#606060',
  gray9: '#6e6e6e',
  gray10: '#7b7b7b',
  gray11: '#b4b4b4',
  gray12: '#eeeeee',

  grayA1: '#00000000',
  grayA2: '#ffffff09',
  grayA3: '#ffffff12',
  grayA4: '#ffffff1b',
  grayA5: '#ffffff22',
  grayA6: '#ffffff2c',
  grayA7: '#ffffff3b',
  grayA8: '#ffffff55',
  grayA9: '#ffffff64',
  grayA10: '#ffffff72',
  grayA11: '#ffffffaf',
  grayA12: '#ffffffed',

  green1: '#0e1512',
  green2: '#121b17',
  green3: '#132d21',
  green4: '#113b29',
  green5: '#174933',
  green6: '#20573e',
  green7: '#28684a',
  green8: '#2f7c57',
  green9: '#30a46c',
  green10: '#33b074',
  green11: '#3dd68c',
  green12: '#b1f1cb',

  orange1: '#17120e',
  orange2: '#1e160f',
  orange3: '#331e0b',
  orange4: '#462100',
  orange5: '#562800',
  orange6: '#66350c',
  orange7: '#7e451d',
  orange8: '#a35829',
  orange9: '#f76b15',
  orange10: '#ff801f',
  orange11: '#ffa057',
  orange12: '#ffe0c2',

  red1: '#191111',
  red2: '#201314',
  red3: '#3b1219',
  red4: '#500f1c',
  red5: '#611623',
  red6: '#72232d',
  red7: '#8c333a',
  red8: '#b54548',
  red9: '#e5484d',
  red10: '#ec5d5e',
  red11: '#ff9592',
  red12: '#ffd1d9',

  crimson1: '#191114',
  crimson2: '#201318',
  crimson3: '#381525',
  crimson4: '#4d122f',
  crimson5: '#5c1839',
  crimson6: '#6d2545',
  crimson7: '#873356',
  crimson8: '#b0436e',
  crimson9: '#e93d82',
  crimson10: '#ee518a',
  crimson11: '#ff92ad',
  crimson12: '#fdd3e8',

  amber1: '#16120c',
  amber2: '#1d180f',
  amber3: '#302008',
  amber4: '#3f2700',
  amber5: '#4d3000',
  amber6: '#5c3d05',
  amber7: '#714f19',
  amber8: '#8f6424',
  amber9: '#ffc53d',
  amber10: '#ffd60a',
  amber11: '#ffca16',
  amber12: '#ffe7b3',

  tomato1: '#181111',
  tomato2: '#1f1513',
  tomato3: '#391714',
  tomato4: '#4e1511',
  tomato5: '#5e1c16',
  tomato6: '#6e2920',
  tomato7: '#853a2d',
  tomato8: '#ac4d39',
  tomato9: '#e54d2e',
  tomato10: '#ec6142',
  tomato11: '#ff977d',
  tomato12: '#fbd3cb',

  brown1: '#12110f',
  brown2: '#1c1816',
  brown3: '#28211d',
  brown4: '#322922',
  brown5: '#3e3128',
  brown6: '#4d3c2f',
  brown7: '#614a39',
  brown8: '#7c5f46',
  brown9: '#ad7f58',
  brown10: '#b88c67',
  brown11: '#dbb594',
  brown12: '#f2e1ca',

  indigo1: '#11131f',
  indigo2: '#141726',
  indigo3: '#182449',
  indigo4: '#1d2e62',
  indigo5: '#253974',
  indigo6: '#304384',
  indigo7: '#3a4f97',
  indigo8: '#435db1',
  indigo9: '#3e63dd',
  indigo10: '#5472e4',
  indigo11: '#9eb1ff',
  indigo12: '#d6e1ff',

  plum1: '#181118',
  plum2: '#201320',
  plum3: '#351a35',
  plum4: '#451d47',
  plum5: '#512454',
  plum6: '#5e3061',
  plum7: '#734079',
  plum8: '#92549c',
  plum9: '#ab4aba',
  plum10: '#b658c4',
  plum11: '#e796f3',
  plum12: '#f4d4f4',

  yellow1: '#14120b',
  yellow2: '#1b180f',
  yellow3: '#2d2305',
  yellow4: '#362b00',
  yellow5: '#433500',
  yellow6: '#524202',
  yellow7: '#665417',
  yellow8: '#836a21',
  yellow9: '#ffe629',
  yellow10: '#ffff57',
  yellow11: '#f5e147',
  yellow12: '#f6eeb4',

  iris1: '#13131e',
  iris2: '#171625',
  iris3: '#202248',
  iris4: '#262a65',
  iris5: '#303374',
  iris6: '#3d3e82',
  iris7: '#4a4a95',
  iris8: '#5958b1',
  iris9: '#5b5bd6',
  iris10: '#6e6ade',
  iris11: '#b1a9ff',
  iris12: '#e0dffe',

  gold1: '#121211',
  gold2: '#1b1a17',
  gold3: '#24231f',
  gold4: '#2d2b26',
  gold5: '#38352e',
  gold6: '#444039',
  gold7: '#544f46',
  gold8: '#696256',
  gold9: '#978365',
  gold10: '#a39073',
  gold11: '#cbb99f',
  gold12: '#e8e2d9',
};

export const tailwindSpacing = {
  auto: 'auto',
  '0': 0,
  '.5': 0.5,
  '.75': 0.75,
  px: 1,
  'px.5': 1.5,
  '0.5': 2,
  '0.75': 3,
  '1': 4,
  '1.5': 6,
  '1.75': 7,
  '-2': -8,
  '2': 8,
  '2.5': 10,
  '2.75': 11,
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

    borderDefault: lightColors.gray7,
    borderDarker: lightColors.gray8,

    bottomTabBackground: lightColors.mainBgLight,
    bottomTabBorder: lightColors.gray8,
    bottomTabText: lightColors.gray9,

    textDefault: lightColors.gray12,
    textInverse: lightColors.gray1,
    textWhite: lightColors.gray1,
    textBlack: lightColors.gray12,
    textLight: lightColors.gray11,
    textLighter: lightColors.gray10,
    textApricot: brandColors.apricot11,
    textCasal: brandColors.casal7,

    textIntroMarqueeDark: lightColors.gray1,
    textIntroMarqueeLight: darkColors.gray3,

    buttonApricot: brandColors.apricot7,
    buttonCasal: brandColors.casal7,
    buttonPharlap: brandColors.pharlap7,
    buttonNeutral: lightColors.gray2,
    buttonDangerLighter: lightColors.red4,
    buttonNeutralDarker: lightColors.gray5,

    loginButtonDark: darkColors.gray5,

    buttonTextApricot: lightColors.gray1,
    buttonTextCasal: lightColors.gray1,
    buttonTextPharlap: lightColors.gray1,
    buttonTextNeutral: lightColors.gray12,
    buttonTextDanger: lightColors.red11,

    radioButtonBackgroundDefault: lightColors.gray1,
    radioButtonBackgroundSelected: brandColors.apricot8,

    imageBackground: neutralColors.white,
    missingImageBackground: lightColors.gray7,

    inputBackground: lightColors.gray1,
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
    newBillActionStatusBackground: brandColors.apricot2,

    selectedItemBackground: lightColors.green5,
    defaultListRippleBackground: lightColors.gray8,

    bankImageBackground: lightColors.gray7,

    webViewBackground: neutralColors.white,

    datePickerMarkBackground: lightColors.gray4,
    datePickerCategoryLabelText: lightColors.gray10,

    logoApricot: brandColors.apricot6,
    logoCasal: brandColors.casal7,

    billScreenBackground: brandColors.pharlap2,
    billMeterBackground: brandColors.pharlap7,

    defaultItemTagBg: brandColors.casal7,

    cardStripBg: brandColors.pharlap7,
  },
  spacing: tailwindSpacing,
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  borderRadii: {
    none: 0,
    sm: 2,
    sm2: 3,
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
      fontSize: 15,
      color: 'textDefault',
      letterSpacing: -0.14,
    },
    xxs: {
      fontSize: 10,
      lineHeight: 12,
    },
    xs: {
      fontSize: 12,
      lineHeight: 15,
    },
    xs2: {
      fontSize: 13,
      lineHeight: 15,
    },
    sm: {
      fontSize: 14,
      lineHeight: 17.85,
    },
    lg: {
      fontSize: 18,
      lineHeight: 26,
      letterSpacing: -0.6,
    },
    xl: {
      fontSize: 20,
      lineHeight: 20.4,
      letterSpacing: -0.8,
    },
    '2xl': {
      fontSize: 24,
      lineHeight: 26,
      letterSpacing: -0.96,
    },
    '3xl': {
      fontSize: 28,
      lineHeight: 30,
      letterSpacing: -0.96,
    },
    '4xl': {
      fontSize: 32,
      lineHeight: 32.64,
      letterSpacing: -1.28,
    },
    buttonText: {
      fontSize: 15,
      fontFamily: 'Halver-Semibold',
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
      borderTopEndRadius: 'lg',
      borderTopStartRadius: 'lg',
      borderBottomEndRadius: 'lg',
      borderBottomStartRadius: 'lg',
      shadowColor: 'black',
      shadowOffset: {
        width: 0.2,
        height: 0.2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 0.5,
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

    borderDefault: darkColors.grayA5,
    borderDarker: darkColors.gray5,

    bottomTabBackground: darkColors.gray1,
    bottomTabBorder: darkColors.grayA5,
    bottomTabText: darkColors.gray9,

    textDefault: darkColors.gray12,
    textInverse: darkColors.gray1,
    textWhite: darkColors.gray12,
    textBlack: darkColors.gray1,
    textLight: darkColors.gray11,
    textLighter: darkColors.gray10,
    textApricot: brandColors.apricot6,
    textCasal: brandColors.casal4,

    buttonApricot: brandColors.apricot6,
    buttonCasal: brandColors.casal7,
    buttonPharlap: brandColors.pharlap6,
    buttonNeutral: darkColors.gray3,
    buttonDangerLighter: darkColors.red3,
    buttonNeutralDarker: darkColors.gray3,

    loginButtonDark: darkColors.gray5,

    buttonTextApricot: darkColors.gray1,
    buttonTextCasal: darkColors.gray12,
    buttonTextPharlap: darkColors.gray1,
    buttonTextNeutral: darkColors.gray12,
    buttonTextDanger: darkColors.red11,

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
    modalElementBackground: darkColors.gray4,
    modalFilterContainerBorder: darkColors.gray5,

    successModalBackground: darkColors.green3,
    successModalHeadingBackground: darkColors.green1,

    pendingActionStatusBackground: darkColors.gray3,
    overdueActionStatusBackground: darkColors.gray3,
    recurringActionStatusBackground: darkColors.gray3,
    newBillActionStatusBackground: darkColors.gray3,

    selectedItemBackground: darkColors.green3,
    defaultListRippleBackground: darkColors.gray4,

    bankImageBackground: darkColors.gray12,

    webViewBackground: darkColors.gray12,

    datePickerMarkBackground: darkColors.gray3,
    datePickerCategoryLabelText: darkColors.gray10,

    logoApricot: brandColors.apricot8,
    logoCasal: brandColors.casal7,

    billScreenBackground: neutralColors.blackish,
    billMeterBackground: brandColors.pharlap6,

    defaultItemTagBg: brandColors.casal7,

    cardStripBg: brandColors.pharlap6,
  },
};

interface RestyleProviderProps {
  children: React.ReactNode;
}

export const RestyleProvider: React.FunctionComponent<RestyleProviderProps> = ({
  children,
}) => {
  const isDarkMode = useIsDarkModeSelected();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
      {children}
    </ThemeProvider>
  );
};
