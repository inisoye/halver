import * as React from 'react';
import { useModal } from 'react-native-modalfy';

export const useFullScreenLoader = ({ isLoading = false, message = 'Loading...' }) => {
  const { openModal, closeModal } = useModal();

  React.useEffect(() => {
    if (isLoading) {
      openModal('LoaderModal', { message: message });
    } else {
      closeModal();
    }
  }, [isLoading]);
};
