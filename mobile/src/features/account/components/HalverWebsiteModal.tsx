import * as React from 'react';
import { type WebViewNavigation } from 'react-native-webview';

import { Modal, WebView } from '@/components';
import { useBooleanStateControl } from '@/hooks';

interface HalverWebsiteModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  onNavigationStateChange?: (navState: WebViewNavigation) => void;
}

export const HalverWebsiteModal: React.FunctionComponent<
  HalverWebsiteModalProps
> = ({ isModalOpen, closeModal, onNavigationStateChange }) => {
  const {
    state: isLoaderOpen,
    setTrue: startLoader,
    setFalse: closeLoader,
  } = useBooleanStateControl(true);

  return (
    <Modal
      closeModal={closeModal}
      headingText="halverapp.com"
      isLoaderOpen={isLoaderOpen}
      isModalOpen={isModalOpen}
      hasLargeHeading
    >
      <WebView
        backgroundColor="webViewBackground"
        flex={1}
        source={{ uri: 'https://www.halverapp.com/#how-it-works' }}
        onLoadEnd={closeLoader}
        onLoadStart={startLoader}
        onNavigationStateChange={onNavigationStateChange}
      />
    </Modal>
  );
};
