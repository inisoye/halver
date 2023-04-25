import { type AxiosError } from 'axios';

import { capitalizeFirstLetter } from './strings';

/**
 * @param error An axios error instance. Usually returned by React Query.
 * @returns The error message formatted for the UI. Contents of an array are merged into a single string.
 */
export const formatAxiosErrorMessage = (
  // Typed as any because errors from server do not have a consistent shape.
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  error: AxiosError<any, any>,
) => {
  const firstDigitInResponseStatus = String(error.response?.status).charAt(0);

  if (firstDigitInResponseStatus === '5') {
    return 'Server Error';
  }

  // Return default error message string if user is not connected to the internet.
  if (error.code === 'ERR_NETWORK') {
    return `${error.message}. Please check your internet connection.`;
  }

  const errorMessage = Object.values(error.response?.data).flat();

  if (Array.isArray(errorMessage)) {
    const allMessages = errorMessage
      .filter(message => isNaN(Number(message)) && typeof message === 'string')
      .map(message => capitalizeFirstLetter(message as string))
      .join('. ');

    return `${allMessages}`;
  }
};
