import { atomWithReset } from 'jotai/utils';

import { atomWithMMKV } from '@/lib/jotai';

// Create an atom with MMKV storage and an initial value of an empty array
export const tokenAtom = atomWithMMKV<string | undefined>('items', undefined);

// Create an atom with reset functionality that depends on the items atom
export const resetTokenAtom = atomWithReset(tokenAtom);
