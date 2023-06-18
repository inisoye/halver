import {
  createBox,
  createRestyleComponent,
  spacing,
  visible,
  type BoxProps,
  type SpacingProps,
  type VisibleProps,
} from '@shopify/restyle';
import RNWebView, { type WebViewProps as RNWebViewProps } from 'react-native-webview';

import { Theme } from '@/lib/restyle';

export type WebViewProps = BoxProps<Theme> &
  SpacingProps<Theme> &
  VisibleProps<Theme> &
  RNWebViewProps;

export const WebView = createRestyleComponent<WebViewProps, Theme>(
  [spacing, visible],
  createBox<Theme>(RNWebView),
);
