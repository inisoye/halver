import { type AxiosError } from 'axios';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

import { isStringOrArrayOfStrings } from './strings';

/**
 * Formats an object containing errors into a string.
 * The errors/exceptions are usually formatted by Django Rest Framework.
 * https://www.django-rest-framework.org/api-guide/exceptions/#exception-handling-in-rest-framework-views
 *
 * @param errors - An object containing errors, where the keys are (often) field names and the values are error messages.
 * @returns A single string representing the formatted error message that includes all the messages in the initial object.
 */
const formatErrorObject = (errors: {
  [key: string]: string | string[];
}): string => {
  const namedErrors: string[] = [];
  const otherErrors: string[] = [];

  // List out error keys that are usually not associated with input fields.
  const otherErrorKeys = ['non-field-errors', 'nonFieldErrors', 'detail'];

  // Process named errors.
  for (const [key, value] of Object.entries(errors)) {
    if (!value && !isStringOrArrayOfStrings(value)) {
      continue;
    }

    if (!otherErrorKeys.includes(key) && value?.length) {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);

      if (Array.isArray(value) && value.length) {
        namedErrors.push(`${formattedKey}: ${value.join(', ')}`);
      }
    }
  }

  // Process non-named errors.
  for (const key of otherErrorKeys) {
    const value = errors[key];

    if (!value && !isStringOrArrayOfStrings(value)) {
      continue;
    }

    if (typeof value === 'string') {
      otherErrors.push(value);
    } else if (Array.isArray(value) && value.length) {
      otherErrors.push(value.join('. '));
    }
  }

  // Combine named and non-named errors.
  const result: string[] = [...namedErrors];
  if (otherErrors.length) {
    result.push(
      `${namedErrors.length > 1 ? 'Other errors: ' : ''}${otherErrors.join(
        '. ',
      )}`,
    );
  }

  // Remove trailing full stops except the last item.
  for (let i = 0; i < result.length - 1; i++) {
    result[i] = result[i].replace(/\.$/, '');
  }

  return result.join('. ');
};

/**
 * @param error An axios error instance. Usually returned by React Query and a Django backend.
 * @returns The error message formatted for the UI. Contents of an array are merged into a single string.
 */
export const formatAxiosErrorMessage = (
  // Typed as any because errors from server do not have a consistent shape.
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  error: AxiosError<any, any>,
) => {
  const firstDigitInResponseStatus = String(error.response?.status).charAt(0);

  if (firstDigitInResponseStatus === '5') {
    return 'There was an error processing that. Please contact support.'; // Generic errors for server errors.
  }

  // Return default error message string if user is not connected to the internet.
  if (error.code === 'ERR_NETWORK') {
    return `${error.message}. Please check your internet connection.`;
  }

  return formatErrorObject(error.response?.data);
};

/**
 * Handles an AxiosError by displaying an error message using Alert and triggering a haptic feedback.
 *
 * @param error The AxiosError to be reported.
 */
export const handleAxiosErrorAlertAndHaptics = (
  heading = 'Error',
  error: AxiosError,
): void => {
  const errorMessage = formatAxiosErrorMessage(error);

  if (errorMessage) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Alert.alert(heading, errorMessage, [
      {
        text: 'OK',
        style: 'default',
      },
    ]);
  }
};

/**
 * Handles an error by displaying an error message using Alert and triggering a haptic feedback.
 *
 * @param heading The error heading that should be displayed in the alert box.
 * @param error The error message to be displayd..
 */
export const handleGenericErrorAlertAndHaptics = (
  heading = 'Error',
  error = 'An error occured.',
): void => {
  if (error) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Alert.alert(heading, error, [
      {
        text: 'OK',
        style: 'default',
      },
    ]);
  }
};
