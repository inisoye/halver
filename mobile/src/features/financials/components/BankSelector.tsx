import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import * as React from 'react';
import { useForm, UseFormSetValue, useWatch } from 'react-hook-form';
import { Keyboard, Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { z } from 'zod';

import { Button, Modal, Text, TextField, TextFieldLabel } from '@/components';
import { useBooleanStateControl, useButtonAnimation } from '@/hooks';
import { Search, SelectCaret, SelectTick } from '@/icons';
import { PaystackBank } from '@/lib/zod';
import { BankDetailsFormValues } from '@/screens';
import { gapStyles } from '@/theme';
import { cn, isIOS } from '@/utils';

import { BanksList } from '../api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SelectedBank = z.infer<typeof PaystackBank>;

interface SelectorOptionProps {
  selectedBank: SelectedBank;
  handleItemClick: (item: SelectedBank) => void;
  item: SelectedBank;
}

const SelectorOption: React.FunctionComponent<SelectorOptionProps> = ({
  selectedBank,
  handleItemClick,
  item,
}) => {
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation();

  return (
    <AnimatedPressable
      className={cn(
        'flex-1 flex-row items-center justify-between py-4',
        selectedBank?.id === item.id && 'bg-green-light-300 dark:bg-green-dark-200',
      )}
      style={[{ gap: 12 }, animatedStyle]} // eslint-disable-line react-native/no-inline-styles
      onPress={() => handleItemClick(item)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        className="ml-6 w-full max-w-[80%] flex-row items-center "
        style={[{ gap: 12 }]} // eslint-disable-line react-native/no-inline-styles
      >
        <Image
          className="h-10 w-10 rounded-lg bg-white"
          contentFit="contain"
          key={item.name}
          source={item.logo}
        />

        <Text className="flex-shrink leading-[20px]" numberOfLines={1}>
          {item.name}
        </Text>
      </View>

      {selectedBank?.id === item.id && <SelectTick className="mr-6" />}
    </AnimatedPressable>
  );
};

interface BankSelectorProps {
  areBanksLoading: boolean;
  banks: BanksList | undefined;
  setValue: UseFormSetValue<BankDetailsFormValues>;
  selectedBank: SelectedBank;
  className?: string | undefined;
}

export const BankSelector: React.FunctionComponent<BankSelectorProps> = ({
  areBanksLoading,
  banks,
  setValue,
  selectedBank,
  className,
}) => {
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();
  const { control: controlForSelectFilter, resetField } = useForm();
  const selectFilterValue = useWatch({ control: controlForSelectFilter });
  // const flashListRef = React.useRef(null);

  const filteredBanks = banks?.filter(bank =>
    bank.name.toLowerCase().includes(selectFilterValue.bankFilter?.toLowerCase() || ''),
  );

  const resetBankFilter = () => resetField('bankFilter');

  const dismissKeyboard = () => Keyboard.dismiss();

  const handleModalClose = () => {
    closeModal();
    resetBankFilter();
  };

  const handleItemClick = (item: SelectedBank) => {
    setValue('bank', item, { shouldValidate: true });
    handleModalClose();
  };

  const renderItem = React.useCallback(
    ({ item }: { item: SelectedBank }) => (
      <SelectorOption
        handleItemClick={handleItemClick}
        item={item}
        selectedBank={selectedBank}
      />
    ),
    [selectedBank?.id], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <View className={className}>
      <TextFieldLabel label="Your bank" />
      <Button
        className={cn('mt-1.5 px-4 ', isIOS() ? 'py-[9.6px]' : 'py-3.5')}
        color="neutral"
        isTextContentOnly={false}
        onPress={openModal}
      >
        {!!selectedBank && (
          <View className="flex-row items-center" style={gapStyles[8]}>
            <Image
              className="h-6 w-6 rounded-lg bg-white"
              contentFit="contain"
              key={selectedBank.name}
              source={selectedBank.logo}
            />

            <Text className="w-48 flex-shrink" numberOfLines={1}>
              {selectedBank.name}
            </Text>
          </View>
        )}
        <Text className="opacity-0">Select a bank</Text>
        <SelectCaret className="ml-auto" />
      </Button>

      <Modal
        closeModal={handleModalClose}
        headingText="Find your bank"
        isLoaderOpen={areBanksLoading}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <View className="flex-1 bg-grey-light-50 py-3 dark:bg-grey-dark-50">
          <View className="px-6">
            <View
              className={cn(
                'border-b border-b-grey-light-300 pb-5 dark:border-b-grey-dark-400',
                areBanksLoading && 'opacity-0',
              )}
            >
              <TextField
                className="bg-grey-light-300 p-2 px-3 dark:bg-grey-dark-200"
                control={controlForSelectFilter}
                name="bankFilter"
                placeholder="Search"
                prefixComponent={<Search />}
                autoFocus
              />
            </View>
          </View>

          <FlashList
            data={filteredBanks}
            estimatedItemSize={108}
            keyboardShouldPersistTaps="handled"
            renderItem={renderItem}
            onScrollBeginDrag={dismissKeyboard}
          />
        </View>
      </Modal>
    </View>
  );
};
