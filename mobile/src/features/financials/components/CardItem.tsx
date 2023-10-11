import * as React from 'react';
import { z } from 'zod';

import { Box, DynamicText, TouchableOpacity } from '@/components';
import { UserCard as UserCardSchema } from '@/lib/zod';
import { convertKebabAndSnakeToTitleCase } from '@/utils';

import { CardIcon } from './CardIcon';

export type Card = z.infer<typeof UserCardSchema>;

interface CardItemProps {
  card: Card;
  openModal: () => void;
  setSelectedCard: (card: Card) => void;
}

export const CardItem: React.FunctionComponent<CardItemProps> = React.memo(
  ({ card, openModal, setSelectedCard }) => {
    const { cardType, last4, uuid, bank, isDefault } = card;

    const openCardDetails = (): void => {
      setSelectedCard(card);
      openModal();
    };

    return (
      <TouchableOpacity
        alignItems="center"
        backgroundColor="inputBackground"
        borderRadius="md"
        columnGap="3"
        elevation={0.5}
        flexDirection="row"
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
        onPress={openCardDetails}
      >
        <Box alignItems="center" columnGap="2" flexDirection="row" width="70%">
          <CardIcon type={cardType} />

          <DynamicText fontFamily="Halver-Semibold" marginLeft="1" variant="sm">
            •••• {last4}
          </DynamicText>

          <DynamicText
            color="textLight"
            fontFamily="Halver-Semibold"
            maxWidth="65%"
            numberOfLines={1}
            variant="sm"
          >
            {!!bank && convertKebabAndSnakeToTitleCase(bank)}
          </DynamicText>
        </Box>

        {isDefault && (
          <Box
            backgroundColor="defaultItemTagBg"
            borderRadius="base"
            px="2"
            py="1"
          >
            <DynamicText
              color="textWhite"
              fontFamily="Halver-Semibold"
              variant="xxs"
            >
              Default
            </DynamicText>
          </Box>
        )}
      </TouchableOpacity>
    );
  },
);
