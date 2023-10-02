import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useTheme } from '@shopify/restyle';
import * as React from 'react';
import { useForm, UseFormSetValue, useWatch } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { z } from 'zod';

import {
  Box,
  Button,
  DynamicText,
  Image,
  Modal,
  RectButton,
  Text,
  TextField,
  TextFieldLabel,
} from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { Search, SelectCaret, SelectInactiveItem, SelectTick } from '@/icons';
import { Theme } from '@/lib/restyle';
import { PaystackBank } from '@/lib/zod';
import { flexStyles, marginAutoStyles } from '@/theme';
import { getInitials, isIOS, useIsDarkModeSelected } from '@/utils';

import { BanksList } from '../api';
import type { BankDetailsFormValues } from './AddTransferRecipientForm';

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
  const isDarkMode = useIsDarkModeSelected();

  const isSelected = React.useMemo(
    () => selectedBank?.id === item.id,
    [selectedBank?.id, item.id],
  );

  const initials = React.useMemo(() => getInitials(item.name), [item.name]);

  const { spacing, colors } = useTheme<Theme>();

  return (
    <RectButton
      activeOpacity={0.07}
      alignItems="center"
      backgroundColor={isSelected ? 'selectedItemBackground' : 'transparent'}
      flex={1}
      flexDirection="row"
      gap="3"
      justifyContent="space-between"
      paddingVertical="4"
      rippleColor={colors.selectedItemBackground}
      underlayColor={isDarkMode ? 'white' : 'black'}
      onPress={() => handleItemClick(item)}
    >
      <Box
        accessibilityRole="button"
        alignItems="center"
        flexDirection="row"
        gap="3"
        marginLeft="6"
        maxWidth="80%"
        width="100%"
      >
        <Box
          backgroundColor="elementBackground"
          borderRadius="md"
          elevation={1}
          shadowColor="black"
          shadowOffset={{
            width: 0.1,
            height: 0.3,
          }}
          shadowOpacity={0.2}
          shadowRadius={0.4}
        >
          {item.logo ? (
            <Image
              backgroundColor={item.logo ? 'white' : 'bankImageBackground'}
              borderRadius="md"
              contentFit="contain"
              height={32}
              source={item.logo}
              width={32}
            />
          ) : (
            <Box
              alignItems="center"
              backgroundColor="white"
              borderRadius="md"
              height={32}
              justifyContent="center"
              width={32}
            >
              <Text color="textBlack" fontFamily="Halver-Semibold" variant="sm">
                {initials}
              </Text>
            </Box>
          )}
        </Box>

        <DynamicText flexShrink={1} lineHeight={20} numberOfLines={1}>
          {item.name}
        </DynamicText>
      </Box>

      {isSelected && (
        <SelectTick
          height={18}
          style={{ marginRight: spacing[6] }}
          width={18}
        />
      )}
      {!isSelected && (
        <SelectInactiveItem
          height={18}
          style={{ marginRight: spacing[6] }}
          width={18}
        />
      )}
    </RectButton>
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

  const renderItem: ListRenderItem<(typeof filteredBanks)[number]> =
    React.useCallback(
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

  const selectedInitials = selectedBank?.name
    ? getInitials(selectedBank.name)
    : '';

  return (
    <>
      <TextFieldLabel label="Your bank" />
      <Button
        backgroundColor="inputBackground"
        disabled={!banks}
        marginTop="1.5"
        paddingHorizontal="4"
        paddingVertical="3"
        onPress={openModal}
      >
        {!!selectedBank && (
          <Box alignItems="center" flexDirection="row" gap="2">
            {selectedBank.logo ? (
              <Image
                backgroundColor="white"
                borderRadius="base"
                contentFit="contain"
                height={18}
                key={selectedBank.name}
                source={selectedBank.logo}
                width={18}
              />
            ) : (
              <Box
                alignItems="center"
                backgroundColor="white"
                borderRadius="base"
                height={18}
                justifyContent="center"
                width={18}
              >
                <Text
                  color="textBlack"
                  fontFamily="Halver-Semibold"
                  variant="xxs"
                >
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
        <Box
          backgroundColor="modalBackground"
          flex={1}
          paddingTop="1.5"
          paddingVertical="3"
        >
          <Box paddingHorizontal="6">
            <Box
              borderBottomColor="modalFilterContainerBorder"
              borderBottomWidth={1}
              opacity={areBanksLoading ? 0 : 1}
              paddingBottom="3"
            >
              <TextField
                control={controlForSelectFilter}
                name="bankFilter"
                paddingBottom={isIOS() ? '2' : '1'}
                paddingHorizontal="3"
                paddingTop={isIOS() ? '2' : '1'}
                placeholder="Search"
                prefixComponent={<Search height={18} width={18} />}
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

          <GestureHandlerRootView style={flexStyles[1]}>
            <FlashList
              data={filteredBanks}
              estimatedItemSize={90}
              keyboardShouldPersistTaps="handled"
              renderItem={renderItem}
              onScrollBeginDrag={dismissKeyboard}
            />
          </GestureHandlerRootView>
        </Box>
      </Modal>
    </>
  );
};
