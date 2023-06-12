import * as React from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import { Button, Modal, Text, TextFieldLabel } from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { SelectCaret } from '@/icons';
import DatePicker from '@/lib/react-native-date-picker';
import { gapStyles } from '@/theme';
import { cn, isIOS } from '@/utils';

interface BillDeadlineSelectorProps {
  control?:
    | Control<{
        deadline: Date;
        name: string;
        totalAmountDue: number;
      }>
    | undefined;
}

export const BillDeadlineSelector: React.FunctionComponent<
  BillDeadlineSelectorProps
> = ({ control }) => {
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const currentYear = React.useMemo(() => new Date().getFullYear(), []);
  const futureYear = React.useMemo(() => currentYear + 2, [currentYear]);

  const deadline = useWatch({ control, name: 'deadline' });

  return (
    <>
      <TextFieldLabel label="Select a deadline" />
      <Button
        className={cn('mt-1.5 px-4 ', isIOS() ? 'py-[9.6px]' : 'py-3.5')}
        color="neutral"
        isTextContentOnly={false}
        onPress={openModal}
      >
        <View className="flex-row items-center" style={gapStyles[8]}>
          <Text className="w-48 flex-shrink" numberOfLines={1}>
            {deadline ? deadline.toDateString() : 'Select a date'}
          </Text>
        </View>

        <SelectCaret className="ml-auto" />
      </Button>
      <Modal
        closeModal={closeModal}
        headingText="Select a deadline"
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <View className="bg-grey-light-50 p-6 pb-8 dark:bg-grey-dark-50">
          <Text className="mb-6" color="light" variant="sm">
            The bill's deadline must be in the future.
          </Text>

          <Controller
            control={control}
            name="deadline"
            render={({ field: { onChange, value } }) => {
              return (
                <DatePicker
                  endYear={futureYear}
                  fontSize={16}
                  format="yyyy-mm-dd"
                  height={160}
                  markHeight={36}
                  startYear={currentYear}
                  value={new Date(value)}
                  onChange={onChange}
                />
              );
            }}
            rules={{
              maxLength: 100,
            }}
          />

          <Button
            className="mt-2"
            color="pharlap"
            isTextContentOnly
            onPress={closeModal}
          >
            Okay
          </Button>
        </View>
      </Modal>
    </>
  );
};
