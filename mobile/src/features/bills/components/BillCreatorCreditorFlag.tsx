import * as React from 'react';

import { AnimatedBox, Box, Image, Text } from '@/components';

import { BillCreatorCreditorParticipant } from '../api';

interface BillCreatorCreditorFlagProps {
  creatorOrCreditor: BillCreatorCreditorParticipant;
  hasDelay?: boolean;
  isCreditor?: boolean;
}

export const BillCreatorCreditorFlag: React.FunctionComponent<BillCreatorCreditorFlagProps> =
  React.memo(({ creatorOrCreditor, isCreditor }) => {
    return (
      <AnimatedBox
        alignItems="center"
        borderColor="borderDefault"
        borderRadius="lg"
        borderWidth={1}
        flexDirection="row"
        gap="2"
        justifyContent="space-between"
        opacity={0.9}
        paddingHorizontal="2.5"
        paddingVertical="1.5"
        width="40%"
      >
        <Box width="70%">
          <Text
            color="textLight"
            marginBottom="0.75"
            numberOfLines={1}
            variant="xxs"
          >
            {isCreditor ? 'Bill creditor' : 'Created by'}
          </Text>
          <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="xs">
            {creatorOrCreditor?.firstName}
          </Text>
        </Box>

        <Image
          borderRadius="md"
          contentFit="contain"
          flexShrink={0}
          height={24}
          placeholder={creatorOrCreditor?.profileImageHash}
          source={creatorOrCreditor?.profileImageUrl}
          width={24}
        />
      </AnimatedBox>
    );
  });
