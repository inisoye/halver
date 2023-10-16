import { UserDetails } from '../api';

export const checkIfUserDetailsAreIncomplete = (
  userDetails: UserDetails | undefined,
) => {
  if (!userDetails) {
    return 'no data';
  }

  const {
    phone,
    defaultCard,
    defaultTransferRecipient,
    profileImageHash,
    profileImageUrl,
  } = userDetails || {};

  return (
    !phone ||
    !defaultCard ||
    !defaultTransferRecipient ||
    !profileImageHash ||
    !profileImageUrl
  );
};

export const checkAnyUserDetailsHaveBeenAdded = (
  userDetails: UserDetails | undefined,
) => {
  if (!userDetails) {
    return 'no data';
  }

  const {
    phone,
    defaultCard,
    defaultTransferRecipient,
    profileImageHash,
    profileImageUrl,
  } = userDetails || {};

  return (
    !!phone ||
    !!defaultCard ||
    !!defaultTransferRecipient ||
    (profileImageHash && profileImageUrl)
  );
};
