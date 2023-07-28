import * as React from 'react';

import {
  Box,
  Button,
  DynamicText,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
} from '@/components';
import { CardIcon, useCards } from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { CirclePlus, CreditCard, SelectInactiveItem, SelectTick } from '@/icons';
import { convertKebabAndSnakeToTitleCase } from '@/utils';

export const DefaultCardSelectorModal: React.FunctionComponent = () => {
  const { data: cardsResponse, isLoading: areCardsLoading } = useCards();

  const { results: cards } = cardsResponse || {};

  const {
    state: isCardsModalOpen,
    setTrue: openCardsModal,
    setFalse: closeCardsModal,
  } = useBooleanStateControl();

  // Place default card before others.
  const sortedCards = React.useMemo(
    () =>
      cards?.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1)),
    [cards],
  );

  const onlyOneCardAvailable = sortedCards?.length === 1;

  return (
    <>
      <Button
        backgroundColor="inputNestedButtonBackground"
        disabled={areCardsLoading}
        variant="xs"
        onPress={openCardsModal}
      >
        <Text fontFamily="Halver-Semibold" variant="xs">
          {areCardsLoading ? 'Loading cards' : 'Change default card'}
        </Text>
      </Button>

      <Modal
        closeModal={closeCardsModal}
        headingText={
          onlyOneCardAvailable ? 'Add a new card' : 'Change your default card'
        }
        isLoaderOpen={areCardsLoading}
        isModalOpen={isCardsModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          maxHeight="81%"
          paddingBottom="8"
          paddingHorizontal="6"
          paddingTop="6"
        >
          <DynamicText color="textLight" marginBottom="4" maxWidth="85%" variant="sm">
            {onlyOneCardAvailable
              ? 'You have only one card added. Add a new card to make it your default.'
              : 'Select a card below to make it your default card for payments on Halver.'}
          </DynamicText>

          <ScrollView>
            {sortedCards?.map(({ cardType, last4, uuid, bank, isDefault }) => {
              return (
                <TouchableOpacity
                  alignItems="center"
                  backgroundColor="modalElementBackground"
                  borderRadius="base"
                  columnGap="3"
                  flexDirection="row"
                  justifyContent="space-between"
                  key={uuid}
                  marginBottom="2.5"
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
                      color="textLight"
                      fontFamily="Halver-Semibold"
                      marginLeft="1"
                      maxWidth="65%"
                      numberOfLines={1}
                      variant="sm"
                    >
                      {!!bank && convertKebabAndSnakeToTitleCase(bank)}
                    </DynamicText>
                    <Text fontFamily="Halver-Semibold" variant="sm">
                      •••• {last4}
                    </Text>
                  </Box>

                  {isDefault && <SelectTick height={16} width={16} />}
                  {!isDefault && <SelectInactiveItem height={16} width={16} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            alignItems="center"
            backgroundColor="modalElementBackground"
            borderRadius="base"
            columnGap="3"
            flexDirection="row"
            justifyContent="space-between"
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
      </Modal>
    </>
  );
};
