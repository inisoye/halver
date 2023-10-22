import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';

export const activateAccount = async () => {
  const response = await apiClient.patch('accounts/activate/');
  return response.data;
};

export const useActivateAccount = () => {
  return useMutation({
    mutationFn: activateAccount,
  });
};
