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
  TouchableOpacity,
} from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { SelectCaret } from '@/icons';
import { BillDetailsFormValues } from '@/screens';
import { marginAutoStyles } from '@/theme';
import { isAndroid, isIOS } from '@/utils';

interface DeadlineSelectorButtonProps {
  openModal: () => void;
  control: Control<BillDetailsFormValues>;
}

const DeadlineSelectorButton: React.FunctionComponent<
  DeadlineSelectorButtonProps
> = ({ openModal, control }) => {
  const deadline = useWatch({ control, name: 'deadline' });

  return (
    <TouchableOpacity
      alignItems="center"
      backgroundColor="inputBackground"
      borderRadius="base"
      flexDirection="row"
      marginTop="1.5"
      paddingHorizontal="4"
      paddingVertical={isIOS() ? '3' : '3'}
      onPress={openModal}
    >
      <Box alignItems="center" flexDirection="row" gap="2">
        <DynamicText
          flexShrink={1}
          fontSize={14.5}
          numberOfLines={1}
          width={192}
        >
          {deadline ? deadline.toDateString() : 'Select a date'}
        </DynamicText>
      </Box>

      <SelectCaret style={marginAutoStyles['ml-auto']} />
    </TouchableOpacity>
  );
};

interface BillDeadlineSelectorProps {
  control: Control<BillDetailsFormValues>;
}

const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
const twoYearsFromNow = new Date(
  new Date().setFullYear(new Date().getFullYear() + 2, 0, 0),
);

export const BillDeadlineSelector: React.FunctionComponent<
  BillDeadlineSelectorProps
> = ({ control }) => {
  const {
    state: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBooleanStateControl();

  const handleOpenModal = () => {
    openModal();
  };

  return (
    <>
      <TextFieldLabel label="Select a deadline" />

      <DeadlineSelectorButton control={control} openModal={handleOpenModal} />

      <Modal
        closeModal={closeModal}
        headingText="Select a deadline"
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="gray1"
          paddingBottom={isAndroid() ? '6' : '8'}
          paddingHorizontal="6"
          paddingTop="6"
        >
          <Text color="textLight" marginBottom="6" variant="sm">
            The bill's deadline must be in the future.
          </Text>

          <Controller
            control={control}
            name="deadline"
            render={({ field: { onChange, value } }) => {
              return (
                <DatePicker
                  maximumDate={twoYearsFromNow}
                  minimumDate={tomorrow}
                  RHFOnChange={onChange}
                  RHFValue={value}
                />
              );
            }}
          />

          <Button
            backgroundColor="buttonApricot"
            marginTop="2"
            onPress={closeModal}
          >
            <Text color="buttonTextApricot" fontFamily="Halver-Semibold">
              Done
            </Text>
          </Button>
        </Box>
      </Modal>
    </>
  );
};
