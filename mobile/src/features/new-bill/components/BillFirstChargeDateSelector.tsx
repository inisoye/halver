import * as React from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import { Button, DatePicker, Modal, Text, TextFieldLabel } from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { SelectCaret } from '@/icons';
import { BillDetailsFormValues } from '@/screens';
import { gapStyles } from '@/theme';
import { cn, isIOS } from '@/utils';

interface BillFirstChargeDateSelectorProps {
  control: Control<BillDetailsFormValues>;
}

const currentYear = new Date().getFullYear();
const futureYear = currentYear + 2;

export const BillFirstChargeDateSelector: React.FunctionComponent<
  BillFirstChargeDateSelectorProps
> = ({ control }) => {
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const firstChargeDate = useWatch({ control, name: 'firstChargeDate' });

  return (
    <>
      <TextFieldLabel label="Select a first charge date" />

      <Button
        className={cn('mt-1.5 px-4 ', isIOS() ? 'py-[9.6px]' : 'py-3.5')}
        color="neutral"
        isTextContentOnly={false}
        onPress={openModal}
      >
        <View className="flex-row items-center" style={gapStyles[8]}>
          <Text className="w-48 flex-shrink" numberOfLines={1}>
            {firstChargeDate ? firstChargeDate.toDateString() : 'Select a date'}
          </Text>
        </View>

        <SelectCaret className="ml-auto" />
      </Button>

      <Modal
        closeModal={closeModal}
        headingText="Select a first charge date"
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <View className="bg-grey-light-50 p-6 pb-8 dark:bg-grey-dark-50">
          <Text className="mb-6" color="light" variant="sm">
            The bill's first charge date must be in the future.
          </Text>

          <Controller
            control={control}
            name="firstChargeDate"
            render={({ field: { onChange, value } }) => {
              return (
                <DatePicker
                  endYear={futureYear}
                  fontSize={16}
                  format="yyyy-mm-dd"
                  height={160}
                  markHeight={36}
                  startYear={currentYear}
                  value={value ? new Date(value) : new Date()}
                  onChange={onChange}
                />
              );
            }}
          />

          <Button
            className="mt-2"
            color="apricot"
            isTextContentOnly
            onPress={closeModal}
          >
            Done
          </Button>
        </View>
      </Modal>
    </>
  );
};
