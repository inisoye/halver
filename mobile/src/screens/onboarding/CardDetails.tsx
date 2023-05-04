import * as React from 'react';

import { PaddedScreenHeader, Screen } from '@/components';
import { useGetCardAdditionURL } from '@/features/financials';

export const CardDetails: React.FunctionComponent = () => {
  const { data } = useGetCardAdditionURL();
  console.log(data);

  return (
    <>
      <Screen isHeaderShown={false} hasLogoFooter>
        <PaddedScreenHeader
          heading="We also need your card"
          subHeading="You'll use this to make contributions on Halver. All your details are securely handled by Paystack. You are in full control."
          hasExtraPadding
        />
      </Screen>
    </>
  );
};
