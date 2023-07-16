import * as React from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';

import {
  Box,
  Button,
  DatePicker,
  DynamicText,
  Modal,
  Text,
  TextFieldLabel,
} from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { SelectCaret } from '@/icons';
import { BillDetailsFormValues } from '@/screens';
import { marginAutoStyles } from '@/theme';
import { isIOS } from '@/utils';

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
        backgroundColor="buttonNeutral"
        marginTop="1.5"
        paddingHorizontal="4"
        paddingVertical={isIOS() ? '3' : '3.5'}
        onPress={openModal}
      >
        <Box alignItems="center" flexDirection="row" gap="2">
          <DynamicText flexShrink={1} fontSize={15} numberOfLines={1} width={192}>
            {firstChargeDate ? firstChargeDate.toDateString() : 'Select a date'}
          </DynamicText>
        </Box>

        <SelectCaret style={marginAutoStyles['ml-auto']} />
      </Button>

      <Modal
        closeModal={closeModal}
        headingText="Select a first charge date"
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="gray1"
          paddingBottom="8"
          paddingHorizontal="6"
          paddingTop="6"
        >
          <Text color="textLight" marginBottom="6" variant="sm">
            The bill's first charge date must be in the future.
          </Text>

          <Controller
            control={control}
            name="firstChargeDate"
            render={({ field: { onChange, value } }) => {
              return (
                <DatePicker
                  endYear={futureYear}
                  fontSize={15}
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

          <Button backgroundColor="buttonApricot" marginTop="2" onPress={closeModal}>
            <Text color="buttonTextApricot" fontFamily="Halver-Semibold">
              Done
            </Text>
          </Button>
        </Box>
      </Modal>
    </>
  );
};
