import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';

export const closeAccount = async () => {
  const response = await apiClient.patch('accounts/close/');
  return response.data;
};

export const useCloseAccount = () => {
  return useMutation({
    mutationFn: closeAccount,
  });
};
