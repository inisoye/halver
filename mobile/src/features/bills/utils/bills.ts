import { lightColors } from '@/lib/restyle';

import { StatusColorIndex, StatusInfo, StatusMessageIndex } from '../types';

export const statusColorIndex: StatusColorIndex = {
  unregistered: 'yellow11',
  pending: 'orange11',
  overdue: 'red11',
  opted_out: 'red11',
  pending_transfer: 'orange11',
  failed_transfer: 'red11',
  reversed_transfer: 'red11',
  cancelled: 'red11',
  completed: 'green11',
  ongoing: 'green11',
  last_payment_failed: 'red11',
};

/**
 * Generates a human readable message to represent the frequency of the most common status in a bill.
 *
 * @param areAllStatusesSame - Whether or not all bill actions have the same status.
 * @param mostCommonStatus - The most common status code.
 * @param mostCommonStatusCount - The number of bill actions with the most common status.
 */
export function generateLongStatus({
  areAllStatusesSame,
  mostCommonStatus,
  mostCommonStatusCount,
}: StatusInfo): { message: string; color: keyof typeof lightColors } {
  const billStatusMessagePrefix = areAllStatusesSame
    ? 'All'
    : `${mostCommonStatusCount}`;

  const statusCountIsPlural = mostCommonStatusCount > 1 || areAllStatusesSame;
  const pluralSuffix = statusCountIsPlural ? 's' : '';

  const statusMessageIndex: StatusMessageIndex = {
    unregistered: `${billStatusMessagePrefix} unregistered`,
    pending: `${billStatusMessagePrefix} yet to accept`,
    overdue: `${billStatusMessagePrefix} payment${pluralSuffix} overdue`,
    opted_out: `${billStatusMessagePrefix} opted out`,
    pending_transfer: `${billStatusMessagePrefix} transfer${pluralSuffix} pending`,
    failed_transfer: `${billStatusMessagePrefix} transfer${pluralSuffix} failed`,
    reversed_transfer: `${billStatusMessagePrefix} transfer${pluralSuffix} reversed`,
    cancelled: areAllStatusesSame
      ? 'Bill cancelled'
      : `${billStatusMessagePrefix} cancelled`,
    completed: `${billStatusMessagePrefix} payment${pluralSuffix} completed`,
    ongoing: `${billStatusMessagePrefix} subscription${pluralSuffix} ongoing`,
    last_payment_failed: `${billStatusMessagePrefix} payment${pluralSuffix} failed`,
  };

  return {
    message: statusMessageIndex[mostCommonStatus],
    color: statusColorIndex[mostCommonStatus],
  };
}
