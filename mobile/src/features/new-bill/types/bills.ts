import { z } from 'zod';

import { BillCreateMMKV as BillCreateMMKVSchema } from '@/lib/zod';

export type BillCreationMMKVPayload = z.infer<typeof BillCreateMMKVSchema>;
