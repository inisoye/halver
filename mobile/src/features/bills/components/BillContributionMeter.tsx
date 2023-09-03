import type { ResponsiveValue } from '@shopify/restyle';
import * as React from 'react';
import type { DimensionValue } from 'react-native';

import { AnimatedBox, Box, DynamicText, Text } from '@/components';
import { convertNumberToNaira } from '@/utils';

interface BillContributionMeterProps {
  totalAmountPaid: number;
  totalAmountDue: number;
  isRecurring?: boolean;
}

export const BillContributionMeter: React.FunctionComponent<
  BillContributionMeterProps
> = ({ totalAmountPaid, totalAmountDue, isRecurring = false }) => {
  const percentagePaid =
    totalAmountDue > 0
      ? Math.min(100, (totalAmountPaid / totalAmountDue) * 100).toFixed()
      : 0;

  return (
    <>
      <Box backgroundColor="elementBackground" borderRadius="sm2" height={12}>
        <AnimatedBox
          backgroundColor="billMeterBackground"
          borderRadius="sm2"
          height={12}
          width={
            `${percentagePaid}%` as ResponsiveValue<
              DimensionValue | undefined,
              {
                phone: number;
                tablet: number;
              }
            >
          }
        />
      </Box>

      <Box flexDirection="row" gap="4" justifyContent="space-between" marginTop="2">
        <Text color="textLight" fontFamily="Halver-Semibold" variant="xs">
          {totalAmountPaid === 0
            ? `No contributions${isRecurring ? '' : ' yet'}`
            : `${percentagePaid}% contributed`}
        </Text>
        <DynamicText
          fontFamily="Halver-Semibold"
          maxWidth="64%"
          textAlign="right"
          variant="xs"
        >
          {convertNumberToNaira(totalAmountPaid)} out of{' '}
          {convertNumberToNaira(totalAmountDue)}
        </DynamicText>
      </Box>
    </>
  );
};
