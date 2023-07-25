import { z } from 'zod';

import {
  BillActionStatusEnum as BillActionStatusEnumSchema,
  BillDetailAction as BillDetailActionSchema,
} from '@/lib/zod';

export type BillActionStatus = z.infer<typeof BillActionStatusEnumSchema>;
export type BillDetailAction = z.infer<typeof BillDetailActionSchema>;
