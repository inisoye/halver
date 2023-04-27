import { UserDetails } from '../api';

export const getUserDetailsStatus = (
  token: string | undefined,
  userDetails: UserDetails | undefined,
) => {
  if (!token) {
    return 'No token';
  } else if (!userDetails?.phone) {
    return 'No phone';
  } else if (!userDetails?.defaultCard) {
    return 'No card';
  } else if (!userDetails?.defaultTransferRecipient) {
    return 'No transfer recipient';
  } else if (!userDetails?.profileImageHash || !userDetails?.profileImageUrl) {
    return 'No photo';
  }

  return 'Details complete';
};
