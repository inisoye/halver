import * as React from 'react';

import { Box, DynamicText, Screen, ScrollView, TouchableOpacity } from '@/components';
import { CardIcon, useCards } from '@/features/financials';
import { useFullScreenLoader } from '@/hooks';
import { CirclePlus, CreditCard } from '@/icons';
import { gapStyles } from '@/theme';
import { convertKebabAndSnakeToTitleCase } from '@/utils';

export const Cards: React.FunctionComponent = () => {
  const { data: cardsResponse, isLoading: areCardsLoading } = useCards();

  const { results: cards } = cardsResponse || {};

  // Place default card before others.
  const sortedCards = React.useMemo(
    () =>
      cards?.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1)),
    [cards],
  );

  const areThereCards = !areCardsLoading && !!sortedCards && sortedCards?.length > 0;
  const onlyOneCardAvailable = sortedCards?.length === 1;

  useFullScreenLoader({
    isLoading: areCardsLoading,
    message: 'Loading your cards...',
  });

  return (
    <Screen>
      {!areCardsLoading && (
        <>
          <Box flex={1} paddingHorizontal="6" paddingVertical="2">
            {areThereCards ? (
              <DynamicText
                color="textLight"
                marginBottom="4"
                maxWidth="90%"
                variant="sm"
              >
                {onlyOneCardAvailable
                  ? 'Cards are used to make contributions on Halver. You have only one card added.'
                  : 'Cards are used to make contributions on Halver. Select a card below to delete it or make it your default.'}
              </DynamicText>
            ) : (
              <DynamicText
                color="textLight"
                marginBottom="4"
                maxWidth="90%"
                variant="sm"
              >
                Cards are used to make contributions on Halver. You currently have none
                added.
              </DynamicText>
            )}

            <ScrollView contentContainerStyle={gapStyles[12]} flexGrow={0}>
              {sortedCards?.map(({ cardType, last4, uuid, bank, isDefault }) => {
                return (
                  <TouchableOpacity
                    alignItems="center"
                    backgroundColor="elementBackground"
                    borderRadius="base"
                    columnGap="3"
                    flexDirection="row"
                    justifyContent="space-between"
                    key={uuid}
                    paddingHorizontal="4"
                    paddingVertical="2.5"
                  >
                    <Box
                      alignItems="center"
                      columnGap="2"
                      flexDirection="row"
                      width="70%"
                    >
                      <CardIcon type={cardType} />

                      <DynamicText
                        fontFamily="Halver-Semibold"
                        marginLeft="1"
                        variant="sm"
                      >
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
                      <Box backgroundColor="green10" borderRadius="base" px="2" py="1">
                        <DynamicText
                          color="textInverse"
                          fontFamily="Halver-Semibold"
                          variant="xxs"
                        >
                          Default
                        </DynamicText>
                      </Box>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              alignItems="center"
              backgroundColor="elementBackground"
              borderRadius="base"
              columnGap="3"
              flexDirection="row"
              justifyContent="space-between"
              marginTop="3"
              mb="1"
              paddingHorizontal="4"
              paddingVertical="2.5"
            >
              <Box alignItems="center" columnGap="2" flexDirection="row" width="70%">
                <CreditCard />

                <DynamicText
                  color="textLight"
                  fontFamily="Halver-Semibold"
                  marginLeft="1"
                  maxWidth="65%"
                  numberOfLines={1}
                  variant="sm"
                >
                  Add a new card
                </DynamicText>
              </Box>

              <CirclePlus />
            </TouchableOpacity>
          </Box>
        </>
      )}
    </Screen>
  );
};
