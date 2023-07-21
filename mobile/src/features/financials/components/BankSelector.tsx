import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import { useForm, UseFormSetValue, useWatch } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { z } from 'zod';

import {
  Box,
  Button,
  DynamicText,
  Image,
  Modal,
  Pressable,
  Text,
  TextField,
  TextFieldLabel,
} from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { Search, SelectCaret, SelectInactiveItem, SelectTick } from '@/icons';
import { Theme } from '@/lib/restyle';
import { PaystackBank } from '@/lib/zod';
import { BankDetailsFormValues } from '@/screens';
import { marginAutoStyles } from '@/theme';
import { getInitials, isIOS } from '@/utils';

import { BanksList } from '../api';

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
  const isSelected = React.useMemo(
    () => selectedBank?.id === item.id,
    [selectedBank?.id, item.id],
  );

  const initials = React.useMemo(() => getInitials(item.name), [item.name]);

  const { spacing } = useTheme<Theme>();

  return (
    <Pressable
      alignItems="center"
      backgroundColor={isSelected ? 'selectedItemBackground' : 'transparent'}
      flex={1}
      flexDirection="row"
      gap="3"
      justifyContent="space-between"
      paddingVertical="4"
      onPress={() => handleItemClick(item)}
    >
      <Box
        alignItems="center"
        flexDirection="row"
        gap="3"
        marginLeft="6"
        maxWidth="80%"
        width="100%"
      >
        {item.logo ? (
          <Image
            backgroundColor={item.logo ? 'white' : 'bankImageBackground'}
            borderRadius="lg"
            contentFit="contain"
            height={40}
            source={item.logo}
            width={40}
          />
        ) : (
          <Box
            alignItems="center"
            backgroundColor="white"
            borderRadius="lg"
            height={40}
            justifyContent="center"
            width={40}
          >
            <Text color="textBlack" fontFamily="Halver-Semibold" variant="sm">
              {initials}
            </Text>
          </Box>
        )}

        <DynamicText flexShrink={1} lineHeight={20} numberOfLines={1}>
          {item.name}
        </DynamicText>
      </Box>

      {isSelected && <SelectTick style={{ marginRight: spacing[6] }} />}
      {!isSelected && <SelectInactiveItem style={{ marginRight: spacing[6] }} />}
    </Pressable>
  );
};

interface BankSelectorProps {
  areBanksLoading: boolean;
  banks: BanksList | undefined;
  setValue: UseFormSetValue<BankDetailsFormValues>;
  selectedBank: SelectedBank;
}

export const BankSelector: React.FunctionComponent<BankSelectorProps> = ({
  areBanksLoading,
  banks,
  setValue,
  selectedBank,
}) => {
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const { control: controlForSelectFilter, resetField } = useForm();

  const selectFilterObject = useWatch({ control: controlForSelectFilter });
  const selectFilterValue = selectFilterObject.bankFilter;

  const filteredBanks = React.useMemo(() => {
    if (banks && selectFilterValue) {
      return banks?.filter(bank =>
        bank.name.toLowerCase().includes(selectFilterValue.toLowerCase()),
      );
    }

    return banks || [];
  }, [banks, selectFilterValue]);

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

  const renderItem: ListRenderItem<(typeof filteredBanks)[number]> = React.useCallback(
    ({ item }: { item: SelectedBank }) => (
      <SelectorOption
        handleItemClick={handleItemClick}
        item={item}
        selectedBank={selectedBank}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedBank],
  );

  const noBankMatchesFilter = filteredBanks?.length === 0;

  const selectedInitials = selectedBank?.name ? getInitials(selectedBank.name) : '';

  return (
    <>
      <TextFieldLabel label="Your bank" />
      <Button
        backgroundColor="buttonNeutral"
        disabled={!banks}
        marginTop="1.5"
        paddingHorizontal="4"
        paddingVertical={isIOS() ? '2.5' : '3'}
        onPress={openModal}
      >
        {!!selectedBank && (
          <Box alignItems="center" flexDirection="row" gap="2">
            {selectedBank.logo ? (
              <Image
                backgroundColor="white"
                borderRadius="lg"
                contentFit="contain"
                height={24}
                key={selectedBank.name}
                source={selectedBank.logo}
                width={24}
              />
            ) : (
              <Box
                alignItems="center"
                backgroundColor="white"
                borderRadius="lg"
                height={24}
                justifyContent="center"
                width={24}
              >
                <Text color="textBlack" fontFamily="Halver-Semibold" variant="xxs">
                  {selectedInitials}
                </Text>
              </Box>
            )}

            <DynamicText flexShrink={1} numberOfLines={1} width={192}>
              {selectedBank.name}
            </DynamicText>
          </Box>
        )}

        {!selectedBank && (
          <Text color="inputPlaceholder">
            {areBanksLoading ? 'Loading banks' : 'Select a bank'}
          </Text>
        )}

        <SelectCaret style={marginAutoStyles['ml-auto']} />
      </Button>

      <Modal
        closeModal={handleModalClose}
        headingText="Select your bank"
        isLoaderOpen={areBanksLoading}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box backgroundColor="modalBackground" flex={1} paddingVertical="3">
          <Box paddingHorizontal="6">
            <Box
              borderBottomColor="modalFilterContainerBorder"
              borderBottomWidth={1}
              opacity={areBanksLoading ? 0 : 1}
              paddingBottom="5"
            >
              <TextField
                control={controlForSelectFilter}
                name="bankFilter"
                paddingHorizontal="3"
                paddingVertical={isIOS() ? '2' : '1'}
                placeholder="Search"
                prefixComponent={<Search />}
                autoFocus
                isDarker
              />
            </Box>
          </Box>

          {noBankMatchesFilter && (
            <Text color="textLight" padding="6">
              We found no banks matching "{selectFilterValue}"
            </Text>
          )}

          <FlashList
            data={filteredBanks}
            estimatedItemSize={90}
            keyboardShouldPersistTaps="handled"
            renderItem={renderItem}
            onScrollBeginDrag={dismissKeyboard}
          />
        </Box>
      </Modal>
    </>
  );
};
