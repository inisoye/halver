// import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';

// import { useForm } from 'react-hook-form';
// import { z } from 'zod';

import { PaddedScreenHeader, Screen } from '@/components';

// const BankDetailsFormSchema = z.object({
//   accountNumber: z.string(),
//   bank: z.string(),
// });

// type BankDetailsFormValues = z.infer<typeof BankDetailsFormSchema>;

export const BankAccountDetails: React.FunctionComponent = () => {
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<BankDetailsFormValues>({
  //   defaultValues: { accountNumber: undefined },
  //   resolver: zodResolver(BankDetailsFormSchema),
  // });

  return (
    <Screen isHeaderShown={false}>
      <PaddedScreenHeader
        heading="Your bank account details"
        subHeading="This will be where you'll get paid on Halver. You can always change it or add more later."
        hasExtraPadding
      />
    </Screen>
  );
};
