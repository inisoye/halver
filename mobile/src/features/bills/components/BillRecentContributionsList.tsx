import * as React from 'react';

import { Box, Text, TouchableOpacity } from '@/components';
import { RightCaret } from '@/icons';
import { convertNumberToNaira } from '@/utils';

import { useBillTransactions } from '../api';

const hitSlop = {
  top: 10,
  right: 40,
  bottom: 10,
  left: 40,
};

interface BillRecentContributionsListProps {
  id: string;
  isDiscreet: boolean | undefined;
}

export const BillRecentContributionsList: React.FunctionComponent<
  BillRecentContributionsListProps
> = ({ id, isDiscreet }) => {
  const { data: billTransactionsResponse, isLoading: areBillTransactionsLoading } =
    useBillTransactions(id);

  const { results: billTransactions } = billTransactionsResponse || {};

  const noTransactions = !!billTransactions && billTransactions.length < 1;
  const isDisabled = isDiscreet || noTransactions || areBillTransactionsLoading;

  return (
    <Box>
      <TouchableOpacity
        alignItems="center"
        disabled={isDisabled}
        flexDirection="row"
        gap="4"
        hitSlop={hitSlop}
        justifyContent="space-between"
        marginBottom="3"
      >
        <Text fontFamily="Halver-Semibold" variant="xl">
          Recent contributions
        </Text>

        {!isDisabled && <RightCaret isDark />}
      </TouchableOpacity>

      {noTransactions && (
        <Box
          backgroundColor="elementBackground"
          borderRadius="lg"
          paddingHorizontal="4"
          paddingVertical="2.5"
        >
          <Text color="textLight" variant="sm">
            No one has made a contribution yet.
          </Text>
        </Box>
      )}

      <Box gap="3">
        {billTransactions?.map(({ contribution, payingUser, uuid, created }) => {
          return (
            <TouchableOpacity
              backgroundColor="elementBackground"
              borderRadius="lg"
              elevation={1}
              flexDirection="row"
              gap="4"
              justifyContent="space-between"
              key={uuid}
              paddingHorizontal="4"
              paddingVertical="2.5"
              shadowColor="black"
              shadowOffset={{
                width: 0.1,
                height: 0.3,
              }}
              shadowOpacity={0.2}
              shadowRadius={0.3}
            >
              <Box alignItems="center" flexDirection="row" gap="4">
                <Box gap="0.75">
                  <Text fontFamily="Halver-Semibold" variant="sm">
                    From {payingUser?.firstName}
                  </Text>

                  <Text color="textLight" variant="xs">
                    on {new Date(created).toDateString()}
                  </Text>
                </Box>
              </Box>

              <Text color="textLight" variant="xs">
                {convertNumberToNaira(Number(contribution))}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Box>
    </Box>
  );
};
