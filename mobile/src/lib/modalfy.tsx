import * as React from 'react';
import {
  createModalStack,
  ModalOptions,
  ModalProvider,
  ModalStackConfig,
} from 'react-native-modalfy';

import { LoaderModal } from '@/components';

interface ModalfyProviderProps {
  children: React.ReactNode;
}

export interface ModalStackParams {
  LoaderModal: {
    message: string;
  };
}

const modalConfig: ModalStackConfig = { LoaderModal };
const defaultOptions: ModalOptions = { backdropOpacity: 0.6 };

const stack = createModalStack<ModalStackParams>(modalConfig, defaultOptions);

export const ModalfyProvider: React.FunctionComponent<ModalfyProviderProps> = ({
  children,
}) => {
  return <ModalProvider stack={stack}>{children}</ModalProvider>;
};
