import * as React from 'react';
import WebView, { type WebViewNavigation } from 'react-native-webview';

import { Modal } from '@/components';
import { useBooleanStateControl } from '@/hooks';

interface PaystackCardAdditionModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  authorizationUrl: string;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
}

export const PaystackCardAdditionModal: React.FunctionComponent<PaystackCardAdditionModalProps> = ({
  isModalOpen,
  closeModal,
  authorizationUrl,
  onNavigationStateChange,
}) => {
  const {
    state: isLoaderOpen,
    setTrue: startLoader,
    setFalse: closeLoader,
  } = useBooleanStateControl(true);

  return (
    <Modal closeModal={closeModal} isLoaderOpen={isLoaderOpen} isModalOpen={isModalOpen}>
      <WebView
        className="flex-1 bg-grey-dark-50 dark:bg-main-bg-light"
        source={{ uri: authorizationUrl }}
        onLoadEnd={closeLoader}
        onLoadStart={startLoader}
        onNavigationStateChange={onNavigationStateChange}
      />
    </Modal>
  );
};
