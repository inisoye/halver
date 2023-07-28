import * as React from 'react';
import { FadeInUp } from 'react-native-reanimated';

import { AnimatedBox, Box, Image, Text } from '@/components';

import { BillCreatorCreditorParticipant } from '../api';

interface BillCreatorCreditorFlagProps {
  creatorOrCreditor: BillCreatorCreditorParticipant;
  hasDelay?: boolean;
  isCreditor?: boolean;
}

export const BillCreatorCreditorFlag: React.FunctionComponent<BillCreatorCreditorFlagProps> =
  React.memo(({ creatorOrCreditor, hasDelay, isCreditor }) => {
    return (
      <AnimatedBox
        alignItems="center"
        borderBottomLeftRadius="lg"
        borderBottomRightRadius="lg"
        borderColor="borderDefault"
        borderTopWidth={0}
        borderWidth={1}
        entering={FadeInUp.springify().delay(hasDelay ? 200 : 0)}
        flexDirection="row"
        gap="2"
        justifyContent="space-between"
        opacity={0.8}
        paddingHorizontal="2.5"
        paddingVertical="2"
        width="48%"
      >
        <Box width="70%">
          <Text color="textLight" marginBottom="0.75" numberOfLines={1} variant="xxs">
            {isCreditor ? 'Bill creditor' : 'Created by'}
          </Text>
          <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="xs">
            {creatorOrCreditor?.fullName}
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
