import * as React from 'react';
import { useModal } from 'react-native-modalfy';

export const useFullScreenLoader = ({
  isLoading = false,
  message = 'Loading...',
}) => {
  const { openModal, closeModal } = useModal();

  React.useEffect(() => {
    let timeoutId;

    /**
     *  Timeout added to prevent issue of modal(s) not closing when opened in succession.
     *  https://github.com/facebook/react-native/issues/10471
     */

    if (isLoading) {
      timeoutId = setTimeout(() => {
        openModal('LoaderModal', { message: message });
      }, 100);
    } else {
      closeModal();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  return { closeModal };
};
