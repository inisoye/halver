import { z } from 'zod';

import { BillDetailAction as BillDetailActionSchema } from '@/lib/zod';

export type BillDetailAction = z.infer<typeof BillDetailActionSchema>;
