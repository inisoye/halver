import * as React from 'react';

export const useModalControl = (initialState = false) => {
  const [isModalOpen, setIsModalOpen] = React.useState(initialState);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
};
