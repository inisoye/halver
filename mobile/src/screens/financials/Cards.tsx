import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import {
  Box,
  DynamicText,
  FullScreenLoader,
  Screen,
  ScrollView,
  TouchableOpacity,
} from '@/components';
import {
  CardItem,
  prefetchCardAdditionURL,
  SelectedCardModal,
  useCards,
  type Card,
} from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { CirclePlus, CreditCard, Plus } from '@/icons';
import type { FinancialsStackParamList } from '@/navigation';
import { gapStyles } from '@/theme';

type CardsProps = NativeStackScreenProps<FinancialsStackParamList, 'Cards'>;

export const Cards: React.FunctionComponent<CardsProps> = ({ navigation }) => {
  const queryClient = useQueryClient();

  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const [selectedCard, _setSelectedCard] = React.useState<Card | undefined>(
    undefined,
  );

  const setSelectedCard = React.useCallback((card: Card) => {
    _setSelectedCard(card);
  }, []);

  const { data: cardsResponse, isLoading: areCardsLoading } = useCards();

  const { results: cards } = cardsResponse || {};

  // Place default card before others.
  const sortedCards = React.useMemo(
    () =>
      cards?.sort((a, b) =>
        a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1,
      ),
    [cards],
  );

  const areThereCards =
    !areCardsLoading && !!sortedCards && sortedCards?.length > 0;
  const onlyOneCardAvailable = sortedCards?.length === 1;

  const goToAddCard = () => {
    prefetchCardAdditionURL(queryClient);
    navigation.navigate('Add your card');
  };

  return (
    <>
      <SelectedCardModal
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        selectedCard={selectedCard}
      />

      <Screen
        headerRightComponent={
          <TouchableOpacity
            hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
            onPress={goToAddCard}
          >
            <Plus />
          </TouchableOpacity>
        }
      >
        <FullScreenLoader
          isVisible={areCardsLoading}
          message="Loading your cards..."
        />

        {!areCardsLoading && (
          <Box flex={1} paddingVertical="2">
            {areThereCards ? (
              <DynamicText
                color="textLight"
                marginBottom="4"
                maxWidth="90%"
                paddingHorizontal="6"
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
                paddingHorizontal="6"
                variant="sm"
              >
                Cards are used to make contributions on Halver. You currently
                have none added.
              </DynamicText>
            )}

            <ScrollView
              // eslint-disable-next-line react-native/no-inline-styles
              contentContainerStyle={[gapStyles[12], { paddingBottom: 4 }]}
              flexGrow={0}
              paddingBottom="0.5"
              paddingHorizontal="6"
            >
              {sortedCards?.map(card => {
                return (
                  <CardItem
                    card={card}
                    key={card.uuid}
                    openModal={openModal}
                    setSelectedCard={setSelectedCard}
                  />
                );
              })}
            </ScrollView>

            <Box paddingHorizontal="6">
              <TouchableOpacity
                alignItems="center"
                backgroundColor="inputBackground"
                borderRadius="md"
                columnGap="3"
                elevation={0.5}
                flexDirection="row"
                justifyContent="space-between"
                marginTop="3"
                mb="1"
                paddingHorizontal="4"
                paddingVertical="2.5"
                shadowColor="black"
                shadowOffset={{
                  width: 0.1,
                  height: 0.3,
                }}
                shadowOpacity={0.2}
                shadowRadius={0.3}
                onPress={goToAddCard}
              >
                <Box
                  alignItems="center"
                  columnGap="2"
                  flexDirection="row"
                  width="70%"
                >
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
          </Box>
        )}
      </Screen>
    </>
  );
};
