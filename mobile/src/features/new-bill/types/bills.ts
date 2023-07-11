import { z } from 'zod';

import {
  BillCreateMMKV as BillCreateMMKVSchema,
  BillCreate as BillCreateSchema,
} from '@/lib/zod';

export type BillCreationMMKVPayload = z.infer<typeof BillCreateMMKVSchema>;
export type BillCreationPayload = z.infer<typeof BillCreateSchema>;
