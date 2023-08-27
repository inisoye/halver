import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { apiClient } from '@/lib/axios';
import { allStaticQueryKeys } from '@/lib/react-query';
import { PatchedBillActionResponseUpdate as PatchedBillActionResponseUpdateSchema } from '@/lib/zod';

export type BillActionResponsePayload = z.infer<
  typeof PatchedBillActionResponseUpdateSchema
>;

export const updateBillAction = async ({
  id,
  billActionResponseDto,
}: {
  id: string;
  billActionResponseDto: BillActionResponsePayload;
}) => {
  const response = await apiClient.patch(
    `/bills/actions/${id}/`,
    billActionResponseDto,
  );
  return response.data;
};

export const useUpdateBillAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBillAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getBill });
      queryClient.invalidateQueries({ queryKey: allStaticQueryKeys.getBills });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getBillTransactions,
      });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getUserTransactions,
      });
      queryClient.invalidateQueries({
        queryKey: allStaticQueryKeys.getActionStatusCounts,
      });
    },
  });
};
