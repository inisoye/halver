import { z } from 'zod';

export const PatchedExpoPushToken = z
  .object({ expoPushToken: z.string().max(70).nullable() })
  .partial();

export const ExpoPushToken = z
  .object({ expoPushToken: z.string().max(70).nullable() })
  .partial();

export const RegisteredContacts = z.object({
  firstName: z.string(),
  fullName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  profileImageUrl: z.string().url().nullable(),
  profileImageHash: z.string().nullable(),
  username: z.string(),
  uuid: z.string().uuid(),
});

export const RegisteredContactsList = z.array(RegisteredContacts);

export const PaginatedRegisteredContactsList = z
  .object({
    count: z.number().int(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(RegisteredContacts),
  })
  .partial();

export const BillList = z.object({
  created: z.string().datetime(),
  interval: z.string(),
  isCreator: z.boolean(),
  isCreditor: z.boolean(),
  isRecurring: z.boolean(),
  modified: z.string().datetime(),
  name: z.string(),
  participants: z.array(
    z.object({
      fullName: z.string(),
      profileImageUrl: z.string().nullish(),
      profileImageHash: z.string().nullish(),
    }),
  ),
  unregisteredParticipants: z.array(
    z.object({
      name: z.string(),
    }),
  ),
  statusInfo: z.object({
    mostCommonStatus: z.string(),
    mostCommonStatusCount: z.number(),
    areAllStatusesSame: z.boolean(),
  }),
  totalParticipants: z.number().int(),
  uuid: z.string().uuid(),
});

export const PaginatedBillList = z
  .object({
    count: z.number().int(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(BillList),
  })
  .partial();

export const IntervalEnum = z.enum([
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'biannually',
  'annually',
  'none',
]);

export const BillUnregisteredParticipantCreate = z.object({
  contribution: z.number().gte(100).lt(1000000000000000).optional(),
  created: z.string().datetime().optional(),
  modified: z.string().datetime().optional(),
  name: z.string().max(100).optional(),
  phone: z.string().optional(),
  uuid: z.string().uuid().optional(),
});

export const BillRegisteredParticipantMMKV = z.object({
  contribution: z.number().gte(100).lt(1000000000000000).optional(),
  name: z.string().max(100).optional(),
  username: z.string().optional(),
  uuid: z.string().uuid().optional(),
  profileImageUrl: z.string().url().nullable().optional(),
  profileImageHash: z.string().nullable().optional(),
  phone: z.string().optional(),
});

export const BillCreateMMKV = z.object({
  created: z.string().datetime().optional(),
  creator: z.number().int().optional(),
  creditorId: z.string().uuid().optional(),
  currencyCode: z.string().max(3).optional(),
  currencyName: z.string().max(100).optional(),
  currencySymbol: z.string().max(10).optional(),
  deadline: z.date().nullish(),
  evidence: z.string().url().nullish(),
  firstChargeDate: z.date().nullish(),
  interval: IntervalEnum,
  modified: z.string().datetime().optional(),
  name: z.string().max(100),
  notes: z.string().nullish().optional(),
  totalAmountDue: z.string().regex(/^-?\d{0,15}(?:\.\d{0,4})?$/),
  unregisteredParticipants: z.array(BillUnregisteredParticipantCreate).optional(),
  registeredParticipants: z.array(BillRegisteredParticipantMMKV).optional(),
  uuid: z.string().uuid().optional(),
});

export const BillCreate = z.object({
  created: z.string().datetime().optional(),
  creator: z.number().int().optional(),
  creditorId: z.string().uuid().optional(),
  currencyCode: z.string().max(3).optional(),
  currencyName: z.string().max(100).optional(),
  currencySymbol: z.string().max(10).optional(),
  deadline: z.string().datetime().nullish(),
  evidence: z.string().url().nullish(),
  firstChargeDate: z.string().datetime().nullish().optional(),
  interval: IntervalEnum.optional(),
  modified: z.string().datetime().optional(),
  name: z.string().max(100).optional(),
  notes: z.string().nullish().optional(),
  participantsContributionIndex: z.record(z.number()),
  totalAmountDue: z
    .string()
    .regex(/^-?\d{0,15}(?:\.\d{0,4})?$/)
    .optional(),
  unregisteredParticipants: z.array(BillUnregisteredParticipantCreate).optional(),
  uuid: z.string().uuid().optional(),
});

export const BillCreatorCreditorParticipant = z.object({
  dateJoined: z.string().datetime(),
  email: z.string().email(),
  firstName: z.string(),
  fullName: z.string(),
  lastName: z.string(),
  profileImageUrl: z.string().url().nullable(),
  profileImageHash: z.string().nullable(),
  username: z.string(),
  uuid: z.string().uuid(),
});

export const BillActionStatusEnum = z.enum([
  'unregistered',
  'pending',
  'overdue',
  'opted_out',
  'pending_transfer',
  'failed_transfer',
  'reversed_transfer',
  'cancelled',
  'completed',
  'ongoing',
  'last_payment_failed',
]);

export const BillDetailUnregisteredParticipant = z.object({
  created: z.string().datetime(),
  modified: z.string().datetime(),
  name: z.string(),
  phone: z.string(),
  uuid: z.string().uuid(),
});

export const BillDetailAction = z.object({
  contribution: z
    .string()
    .regex(/^-?\d{0,15}(?:\.\d{0,4})?$/)
    .nullable(),
  created: z.string().datetime(),
  modified: z.string().datetime(),
  participant: BillCreatorCreditorParticipant,
  status: BillActionStatusEnum,
  totalFee: z
    .string()
    .regex(/^-?\d{0,15}(?:\.\d{0,4})?$/)
    .nullable(),
  totalPaymentDue: z
    .string()
    .regex(/^-?\d{0,15}(?:\.\d{0,4})?$/)
    .nullable(),
  unregisteredParticipant: BillDetailUnregisteredParticipant,
  uuid: z.string().uuid(),
});

export const BillDetail = z.object({
  actions: z.array(BillDetailAction),
  created: z.string().datetime(),
  creator: BillCreatorCreditorParticipant,
  creditor: BillCreatorCreditorParticipant,
  currencyCode: z.string(),
  currencyName: z.string(),
  currencySymbol: z.string(),
  deadline: z.string().datetime().nullable(),
  evidence: z.string().url().nullable(),
  firstChargeDate: z.string().datetime().nullable(),
  interval: z.string(),
  isCreator: z.boolean(),
  isCreditor: z.boolean(),
  isDiscreet: z.boolean(),
  isRecurring: z.boolean(),
  modified: z.string().datetime(),
  name: z.string(),
  notes: z.string().nullable(),
  status: z.object({ short: BillActionStatusEnum, long: z.string() }),
  totalAmountDue: z.string().regex(/^-?\d{0,15}(?:\.\d{0,4})?$/),
  totalAmountPaid: z
    .string()
    .regex(/^-?\d{0,15}(?:\.\d{0,4})?$/)
    .optional()
    .default('0.0000'),
  totalParticipants: z.number().int(),
  uuid: z.string().uuid(),
});

export const BillArrearListStatusEnum = z.enum([
  'overdue',
  'forgiven',
  'pending_transfer',
  'completed',
]);

export const BillArrearList = z.object({
  contribution: z
    .string()
    .regex(/^-?\d{0,15}(?:\.\d{0,4})?$/)
    .nullable(),
  created: z.string().datetime(),
  modified: z.string().datetime(),
  participant: z.number().int().nullable(),
  status: BillArrearListStatusEnum,
  totalPaymentDue: z
    .string()
    .regex(/^-?\d{0,15}(?:\.\d{0,4})?$/)
    .nullable(),
  uuid: z.string().uuid(),
});

export const PaginatedBillArrearListList = z
  .object({
    count: z.number().int(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(BillArrearList),
  })
  .partial();

export const BillTransactionBill = z.object({
  name: z.string(),
  uuid: z.string().uuid(),
});

export const TransactionTypeEnum = z.enum(['regular', 'arrear']);

export const BillTransaction = z.object({
  bill: BillTransactionBill,
  contribution: z.string().regex(/^-?\d{0,15}(?:\.\d{0,4})?$/),
  created: z.string().datetime({ offset: true }),
  isCredit: z.boolean(),
  modified: z.string().datetime({ offset: true }),
  payingUser: BillCreatorCreditorParticipant,
  receivingUser: BillCreatorCreditorParticipant,
  totalPayment: z.string().regex(/^-?\d{0,15}(?:\.\d{0,4})?$/),
  transactionType: TransactionTypeEnum,
  uuid: z.string().uuid(),
});

export const PaginatedBillTransactionList = z
  .object({
    count: z.number().int(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(BillTransaction),
  })
  .partial();

export const BillDailyContribution = z.object({
  day: z.string(),
  totalContribution: z.string().regex(/^-?\d{0,15}(?:\.\d{0,4})?$/),
});

export const PaginatedBillDailyContributionList = z
  .object({
    count: z.number().int(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(BillDailyContribution),
  })
  .partial();

export const BillDailyTransaction = z.object({
  day: z.string(),
  transactions: z.array(BillTransaction),
});

export const PaginatedBillDailyTransactionList = z
  .object({
    count: z.number().int(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(BillDailyTransaction),
  })
  .partial();

export const BillUnregisteredParticipantList = z.object({
  created: z.string().datetime(),
  modified: z.string().datetime(),
  name: z.string(),
  phone: z.string(),
  uuid: z.string().uuid(),
});

export const PaginatedBillUnregisteredParticipantListList = z
  .object({
    count: z.number().int(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(BillUnregisteredParticipantList),
  })
  .partial();

export const PatchedBillActionResponseUpdate = z
  .object({ hasParticipantAgreed: z.boolean() })
  .partial();

export const PatchedBillArrearResponseUpdate = z
  .object({ isForgiveness: z.boolean() })
  .partial();

export const SocialLogin = z
  .object({ accessToken: z.string(), code: z.string(), idToken: z.string() })
  .partial();

export const Login = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string(),
});

export const Token = z.object({ key: z.string().max(40) });

export const RestAuthDetail = z.object({ detail: z.string() });

export const PasswordChange = z.object({
  newPassword1: z.string().max(128),
  newPassword2: z.string().max(128),
});

export const PasswordReset = z.object({ email: z.string().email() });

export const PasswordResetConfirm = z.object({
  newPassword1: z.string().max(128),
  newPassword2: z.string().max(128),
  uid: z.string(),
  token: z.string(),
});

export const CustomRegister = z.object({
  username: z.string().min(1).max(150).optional(),
  email: z.string().email(),
  password1: z.string(),
  password2: z.string(),
  phone: z.string().optional(),
  firstName: z.string().max(30).optional(),
  lastName: z.string().max(30).optional(),
});

export const ResendEmailVerification = z.object({ email: z.string().email() });

export const VerifyEmail = z.object({ key: z.string() });

export const CustomUserDefaultCard = z.object({
  accountName: z.string().max(100).nullish(),
  bank: z.string().max(100),
  cardType: z.string().max(10),
  created: z.string().datetime(),
  expMonth: z.string().max(10),
  expYear: z.string().max(10),
  first6: z.string().max(10),
  last4: z.string().max(4),
  uuid: z.string().uuid(),
});

export const RecipientTypeEnum = z.enum(['authorization', 'nuban']);

export const CustomUserDefaultTransferRecipient = z.object({
  accountNumber: z.string().max(10).nullish(),
  authorizationCode: z.string().max(100).nullish(),
  bankCode: z.string().max(10).nullish(),
  bankName: z.string().max(100).nullish(),
  bankLogo: z.string().max(100).nullish(),
  created: z.string().datetime(),
  email: z.string().max(254).email().nullish(),
  name: z.string().max(100),
  recipientCode: z.string().max(100),
  recipientType: RecipientTypeEnum,
  uuid: z.string().uuid(),
});

export const CustomUserDetails = z.object({
  dateJoined: z.string().datetime(),
  defaultCard: CustomUserDefaultCard.nullish(),
  defaultTransferRecipient: CustomUserDefaultTransferRecipient.nullish(),
  email: z.string().max(254).email(),
  firstName: z.string(),
  fullName: z.string(),
  lastName: z.string(),
  phone: z.string().max(128).nullish(),
  profileImageUrl: z.string().max(200).url().nullish(),
  profileImageHash: z.string().max(35).nullish(),
  username: z
    .string()
    .max(150)
    .regex(/^[\w.@+-]+$/),
  uuid: z.string().uuid(),
});

export const PaystackAccountNumberCheck = z.object({
  accountNumber: z.string().optional(),
  bankCode: z.string().nullish().optional(),
});

export const PaystackAccountNumberDetails = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    accountNumber: z.string(),
    accountName: z.string(),
    bankId: z.number(),
  }),
});

export const PaystackBank = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  code: z.string().optional(),
  longcode: z.string().nullable().optional(),
  gateway: z.string().nullable().optional(),
  pay_with_bank: z.boolean().nullable().optional(),
  active: z.boolean().nullable().optional(),
  country: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  is_deleted: z.boolean().nullable().optional(),
  createdAt: z.string().datetime().nullable().optional(),
  updatedAt: z.string().datetime().nullable().optional(),
  logo: z.string().url().nullable().optional(),
});

export const PaystackBanksList = z.array(PaystackBank);

export const PatchedCustomUserDetails = z
  .object({
    dateJoined: z.string().datetime(),
    defaultCard: CustomUserDefaultCard,
    email: z.string().max(254).email(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().max(128).nullable(),
    profileImageUrl: z.string().max(200).url().nullish(),
    profileImageHash: z.string().max(35).nullish(),
    username: z
      .string()
      .max(150)
      .regex(/^[\w.@+-]+$/),
    uuid: z.string().uuid(),
  })
  .partial();

export const UserCard = z.object({
  accountName: z.string().max(100).nullish(),
  authorizationCode: z.string().max(100),
  bank: z.string().max(100),
  cardType: z.string().max(10),
  created: z.string().datetime(),
  email: z.string().max(100).nullish(),
  expMonth: z.string().max(10),
  expYear: z.string().max(10),
  first6: z.string().max(10),
  isDefault: z.boolean().optional(),
  last4: z.string().max(4),
  signature: z.string().max(100),
  user: z.number().int(),
  uuid: z.string().uuid(),
});

export const TransferRecipient = z.object({
  accountNumber: z.string().max(10).nullish(),
  associatedCard: z.number().int().nullish(),
  authorizationCode: z.string().max(100).nullish(),
  bankCode: z.string().max(10).nullish(),
  bankLogo: z.string().nullish(),
  bankName: z.string().max(100).nullish(),
  created: z.string().datetime(),
  email: z.string().max(254).email().nullish(),
  isDefault: z.boolean().optional(),
  name: z.string().max(100),
  recipientCode: z.string().max(100),
  recipientType: z.string(),
  uuid: z.string().uuid(),
});

export const TransferRecipientList = z.array(TransferRecipient);

export const TransferRecipientCreate = z.object({
  accountNumber: z.string().min(10).max(10).optional(),
  authorizationCode: z.string().optional(),
  bankCode: z.string().max(10).optional(),
  email: z.string().email().optional(),
  isDefault: z.boolean().optional(),
  name: z.string().min(1),
  recipientType: z.enum(['nuban', 'authorization']),
});

export const PaginatedUserCardList = z
  .object({
    count: z.number().int(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(UserCard),
  })
  .partial();

export const UserCardAdditionResponse = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    authorizationUrl: z.string().url(),
    accessCode: z.string(),
    reference: z.string(),
  }),
});

export const BillActionStatusCount = z.object({
  status: BillActionStatusEnum,
  count: z.number().int(),
});

export const BillActionStatusCountList = z.array(BillActionStatusCount);

export const NestedBillInActionStatusList = z.object({
  name: z.string(),
  uuid: z.string().uuid(),
});

export const BillActionStatusList = z.object({
  contribution: z
    .string()
    .regex(/^-?\d{0,15}(?:\.\d{0,4})?$/)
    .nullable(),
  created: z.string().datetime({ offset: true }),
  modified: z.string().datetime({ offset: true }),
  status: BillActionStatusEnum,
  totalPaymentDue: z
    .string()
    .regex(/^-?\d{0,15}(?:\.\d{0,4})?$/)
    .nullable(),
  uuid: z.string().uuid(),
  bill: NestedBillInActionStatusList,
});

export const PaginatedBillActionStatusList = z
  .object({
    count: z.number().int(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(BillActionStatusList),
  })
  .partial();
