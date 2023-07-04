import * as React from 'react';

import { Box, Button, DynamicText, Text } from '@/components';
import { SmallAlert } from '@/icons';
import { lightColors } from '@/lib/restyle';
import { convertNumberToNaira } from '@/utils';
import { formatNumberWithCommas } from '@/utils/numbers';

interface AllocationVarianceAlertProps {
  variantAmount: number;
  isExcess: boolean;
  updateBillAmount: () => void;
  totalAllocationTextColor: keyof typeof lightColors | undefined;
}

export const AllocationVarianceAlert: React.FunctionComponent<
  AllocationVarianceAlertProps
> = ({ variantAmount, isExcess, updateBillAmount, totalAllocationTextColor }) => {
  return (
    <Box
      alignItems="center"
      backgroundColor={totalAllocationTextColor}
      flexDirection="row"
      gap="2"
      justifyContent="space-between"
      paddingHorizontal="6"
      paddingVertical="1.5"
    >
      <Box alignItems="center" flexDirection="row" gap="2" maxWidth="68%">
        <SmallAlert />

        <DynamicText color="textInverse" fontFamily="Halver-Semibold" variant="xs">
          {variantAmount > 1
            ? convertNumberToNaira(variantAmount)
            : `₦${formatNumberWithCommas(variantAmount, 10)}`}
          {isExcess ? ' in excess' : ' left'}
        </DynamicText>
      </Box>

      <Button
        backgroundColor="buttonNeutral"
        hitSlop={16}
        variant="xxs"
        onPress={updateBillAmount}
      >
        <Text color="orange12" fontFamily="Halver-Semibold" fontSize={11}>
          {isExcess ? 'Increase ' : 'Reduce '}bill total
        </Text>
      </Button>
    </Box>
  );
};
