import { z } from 'zod';

import { lightColors } from '@/lib/restyle';
import {
  BillCreateMMKV as BillCreateMMKVSchema,
  BillCreate as BillCreateSchema,
} from '@/lib/zod';

import { BillActionStatus } from './actions';

export type BillCreationMMKVPayload = z.infer<typeof BillCreateMMKVSchema>;
export type BillCreationPayload = z.infer<typeof BillCreateSchema>;

export type BillStatus = BillActionStatus;

export type StatusInfo = {
  areAllStatusesSame: boolean;
  mostCommonStatus: BillStatus;
  mostCommonStatusCount: number;
};

export type StatusMessageIndex = Record<BillStatus, string>;
export type StatusColorIndex = Record<BillStatus, keyof typeof lightColors>;
