import * as React from 'react';
import { type WebViewNavigation } from 'react-native-webview';

import { Modal, WebView } from '@/components';
import { useBooleanStateControl } from '@/hooks';

interface PaystackCardAdditionModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  authorizationUrl: string;
  onNavigationStateChange: (navState: WebViewNavigation) => void;
}

export const PaystackCardAdditionModal: React.FunctionComponent<
  PaystackCardAdditionModalProps
> = ({
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
    <Modal
      closeModal={closeModal}
      headingText="Card addition"
      isLoaderOpen={isLoaderOpen}
      isModalOpen={isModalOpen}
      hasLargeHeading
    >
      <WebView
        backgroundColor="webViewBackground"
        flex={1}
        source={{ uri: authorizationUrl }}
        onLoadEnd={closeLoader}
        onLoadStart={startLoader}
        onNavigationStateChange={onNavigationStateChange}
      />
    </Modal>
  );
};
