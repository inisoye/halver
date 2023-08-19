import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UseMutateFunction } from '@tanstack/react-query';
import { AxiosError } from 'axios';
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
import { CardIcon, useCards, useSetDefaultCard } from '@/features/financials';
import { useBooleanStateControl } from '@/hooks';
import { CirclePlus, CreditCard, SelectInactiveItem, SelectTick } from '@/icons';
import type { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import {
  convertKebabAndSnakeToTitleCase,
  handleAxiosErrorAlertAndHaptics,
} from '@/utils';

interface CardItemProps {
  isDefault: boolean | undefined;
  bank: string;
  uuid: string;
  last4: string;
  cardType: string;
  closeCardsModal: () => void;
  setDefaultCard: UseMutateFunction<unknown, unknown, string, unknown>;
}

const CardItem: React.FunctionComponent<CardItemProps> = React.memo(
  ({ cardType, last4, uuid, bank, isDefault, closeCardsModal, setDefaultCard }) => {
    const onSetDefaultCardSubmit = () => {
      setDefaultCard(uuid || '', {
        onSuccess: () => {
          closeCardsModal();
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics(
            'Error setting card as default',
            error as AxiosError,
          );
        },
      });
    };

    return (
      <TouchableOpacity
        alignItems="center"
        backgroundColor="modalElementBackground"
        borderRadius="base"
        columnGap="3"
        flexDirection="row"
        justifyContent="space-between"
        key={uuid}
        marginBottom="3.5"
        paddingHorizontal="4"
        paddingVertical="2.5"
        onPress={onSetDefaultCardSubmit}
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

        {isDefault && <SelectTick height={16} width={16} />}
        {!isDefault && <SelectInactiveItem height={16} width={16} />}
      </TouchableOpacity>
    );
  },
);

interface DefaultCardSelectorModalProps {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<BillsStackParamList, 'Bill Payment', undefined>,
    NativeStackNavigationProp<AppRootStackParamList, 'Bill Payment', undefined>
  >;
}

export const DefaultCardSelectorModal: React.FunctionComponent<
  DefaultCardSelectorModalProps
> = ({ navigation }) => {
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

  const { mutate: setDefaultCard, isLoading: isSetDefaultCardLoading } =
    useSetDefaultCard();

  const goToAddCard = () => {
    closeCardsModal();
    navigation.navigate('Add your card');
  };

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
        isLoaderOpen={areCardsLoading || isSetDefaultCardLoading}
        isModalOpen={isCardsModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          maxHeight="81%"
          opacity={isSetDefaultCardLoading ? 0.6 : 1}
          paddingBottom="8"
          paddingHorizontal="6"
          paddingTop="6"
          pointerEvents={isSetDefaultCardLoading ? 'none' : undefined}
        >
          <DynamicText color="textLight" marginBottom="4" maxWidth="85%" variant="sm">
            {onlyOneCardAvailable
              ? 'You have only one card added. Add a new card to make it your default.'
              : 'Select a card below to make it your default card for payments on Halver.'}
          </DynamicText>

          <ScrollView>
            {sortedCards?.map(({ cardType, last4, uuid, bank, isDefault }) => {
              return (
                <CardItem
                  bank={bank}
                  cardType={cardType}
                  closeCardsModal={closeCardsModal}
                  isDefault={isDefault}
                  key={uuid}
                  last4={last4}
                  setDefaultCard={setDefaultCard}
                  uuid={uuid}
                />
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
            onPress={goToAddCard}
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
