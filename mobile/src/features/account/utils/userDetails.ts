import { UserDetails } from '../api';

export const checkIfUserDetailsAreIncomplete = (
  userDetails: UserDetails | undefined,
) => {
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
