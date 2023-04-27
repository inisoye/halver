import { atomWithMMKV } from '@/lib/jotai';

export const tokenAtom = atomWithMMKV<string | undefined>('items', undefined);
