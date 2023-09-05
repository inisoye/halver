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

  brown1: 'hsl(30, 40.0%, 99.1%)',
  brown2: 'hsl(30, 50.0%, 97.6%)',
  brown3: 'hsl(30, 52.5%, 94.6%)',
  brown4: 'hsl(30, 53.0%, 91.2%)',
  brown5: 'hsl(29, 52.9%, 86.8%)',
  brown6: 'hsl(29, 52.5%, 80.9%)',
  brown7: 'hsl(29, 51.5%, 72.8%)',
  brown8: 'hsl(28, 50.0%, 63.1%)',
  brown9: 'hsl(28, 34.0%, 51.0%)',
  brown10: 'hsl(27, 31.8%, 47.6%)',
  brown11: 'hsl(25, 30.0%, 41.0%)',
  brown12: 'hsl(20, 30.0%, 19.0%)',

  indigo1: 'hsl(225, 60.0%, 99.4%)',
  indigo2: 'hsl(223, 100%, 98.6%)',
  indigo3: 'hsl(223, 98.4%, 97.1%)',
  indigo4: 'hsl(223, 92.9%, 95.0%)',
  indigo5: 'hsl(224, 87.1%, 92.0%)',
  indigo6: 'hsl(224, 81.9%, 87.8%)',
  indigo7: 'hsl(225, 77.4%, 82.1%)',
  indigo8: 'hsl(226, 75.4%, 74.5%)',
  indigo9: 'hsl(226, 70.0%, 55.5%)',
  indigo10: 'hsl(226, 58.6%, 51.3%)',
  indigo11: 'hsl(226, 55.0%, 45.0%)',
  indigo12: 'hsl(226, 62.0%, 17.0%)',

  plum1: 'hsl(292, 90.0%, 99.4%)',
  plum2: 'hsl(300, 100%, 98.6%)',
  plum3: 'hsl(299, 71.2%, 96.4%)',
  plum4: 'hsl(299, 62.0%, 93.8%)',
  plum5: 'hsl(298, 56.1%, 90.5%)',
  plum6: 'hsl(296, 51.3%, 85.8%)',
  plum7: 'hsl(295, 48.2%, 78.9%)',
  plum8: 'hsl(292, 47.7%, 70.8%)',
  plum9: 'hsl(292, 45.0%, 51.0%)',
  plum10: 'hsl(292, 50.2%, 46.9%)',
  plum11: 'hsl(292, 60.0%, 42.5%)',
  plum12: 'hsl(291, 66.0%, 14.0%)',

  yellow1: 'hsl(60, 54.0%, 98.5%)',
  yellow2: 'hsl(52, 100%, 95.5%)',
  yellow3: 'hsl(55, 100%, 90.9%)',
  yellow4: 'hsl(54, 100%, 86.6%)',
  yellow5: 'hsl(52, 97.9%, 82.0%)',
  yellow6: 'hsl(50, 89.4%, 76.1%)',
  yellow7: 'hsl(47, 80.4%, 68.0%)',
  yellow8: 'hsl(48, 100%, 46.1%)',
  yellow9: 'hsl(53, 92.0%, 50.0%)',
  yellow10: 'hsl(50, 100%, 48.5%)',
  yellow11: 'hsl(42, 100%, 29.0%)',
  yellow12: 'hsl(40, 55.0%, 13.5%)',
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

  brown1: 'hsl(22, 15.0%, 8.7%)',
  brown2: 'hsl(20, 28.3%, 10.4%)',
  brown3: 'hsl(20, 28.0%, 14.0%)',
  brown4: 'hsl(21, 28.4%, 16.5%)',
  brown5: 'hsl(22, 28.7%, 18.9%)',
  brown6: 'hsl(23, 29.0%, 22.3%)',
  brown7: 'hsl(25, 29.5%, 27.8%)',
  brown8: 'hsl(27, 30.1%, 35.9%)',
  brown9: 'hsl(28, 34.0%, 51.0%)',
  brown10: 'hsl(28, 41.4%, 55.8%)',
  brown11: 'hsl(28, 60.0%, 64.5%)',
  brown12: 'hsl(30, 67.0%, 94.0%)',

  indigo1: 'hsl(229, 24.0%, 10.0%)',
  indigo2: 'hsl(230, 36.4%, 12.9%)',
  indigo3: 'hsl(228, 43.3%, 17.5%)',
  indigo4: 'hsl(227, 47.2%, 21.0%)',
  indigo5: 'hsl(227, 50.0%, 24.1%)',
  indigo6: 'hsl(226, 52.9%, 28.2%)',
  indigo7: 'hsl(226, 56.0%, 34.5%)',
  indigo8: 'hsl(226, 58.2%, 44.1%)',
  indigo9: 'hsl(226, 70.0%, 55.5%)',
  indigo10: 'hsl(227, 75.2%, 61.6%)',
  indigo11: 'hsl(228, 100%, 75.9%)',
  indigo12: 'hsl(226, 83.0%, 96.3%)',

  plum1: 'hsl(301, 20.0%, 9.4%)',
  plum2: 'hsl(300, 29.8%, 11.2%)',
  plum3: 'hsl(298, 34.4%, 15.3%)',
  plum4: 'hsl(297, 36.8%, 18.3%)',
  plum5: 'hsl(296, 38.5%, 21.1%)',
  plum6: 'hsl(295, 40.4%, 24.7%)',
  plum7: 'hsl(294, 42.7%, 30.6%)',
  plum8: 'hsl(292, 45.1%, 40.0%)',
  plum9: 'hsl(292, 45.0%, 51.0%)',
  plum10: 'hsl(295, 50.0%, 55.4%)',
  plum11: 'hsl(300, 60.0%, 62.0%)',
  plum12: 'hsl(296, 74.0%, 95.7%)',

  yellow1: 'hsl(45, 100%, 5.5%)',
  yellow2: 'hsl(46, 100%, 6.7%)',
  yellow3: 'hsl(45, 100%, 8.7%)',
  yellow4: 'hsl(45, 100%, 10.4%)',
  yellow5: 'hsl(47, 100%, 12.1%)',
  yellow6: 'hsl(49, 100%, 14.3%)',
  yellow7: 'hsl(49, 90.3%, 18.4%)',
  yellow8: 'hsl(50, 100%, 22.0%)',
  yellow9: 'hsl(53, 92.0%, 50.0%)',
  yellow10: 'hsl(54, 100%, 68.0%)',
  yellow11: 'hsl(48, 100%, 47.0%)',
  yellow12: 'hsl(53, 100%, 91.0%)',
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

    textIntroMarqueeDark: lightColors.gray1,
    textIntroMarqueeLight: darkColors.gray3,

    buttonApricot: brandColors.apricot7,
    buttonCasal: brandColors.casal7,
    buttonPharlap: brandColors.pharlap7,
    buttonNeutral: lightColors.gray2,
    buttonDangerLighter: lightColors.red4,
    buttonNeutralDarker: lightColors.gray5,

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
    newBillActionStatusBackground: brandColors.apricot1,

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

    borderDefault: darkColors.gray5,
    borderDarker: darkColors.gray5,

    bottomTabBackground: darkColors.gray1,
    bottomTabBorder: darkColors.gray8,
    bottomTabText: darkColors.gray9,

    textDefault: darkColors.gray12,
    textInverse: darkColors.gray1,
    textWhite: darkColors.gray12,
    textBlack: darkColors.gray1,
    textLight: darkColors.gray11,
    textLighter: darkColors.gray10,
    textApricot: brandColors.apricot6,

    buttonApricot: brandColors.apricot6,
    buttonCasal: brandColors.casal7,
    buttonPharlap: brandColors.pharlap6,
    buttonNeutral: darkColors.gray3,
    buttonDangerLighter: darkColors.red3,
    buttonNeutralDarker: darkColors.gray3,

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
    <ThemeProvider theme={isDarkMode ? darkTheme : theme}>{children}</ThemeProvider>
  );
};
