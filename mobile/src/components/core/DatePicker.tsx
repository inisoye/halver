import * as React from 'react';
import RNDatePicker from 'react-native-date-picker';

import { useIsDarkModeSelected } from '@/utils';

interface DatePickerProps {
  RHFOnChange: (date: Date | undefined) => void;
  RHFValue: Date | undefined;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const DatePicker: React.FunctionComponent<DatePickerProps> = ({
  RHFOnChange,
  RHFValue,
  maximumDate,
  minimumDate,
}) => {
  const isDarkMode = useIsDarkModeSelected();

  return (
    <RNDatePicker
      date={RHFValue || new Date()}
      fadeToColor={isDarkMode ? 'rgba(22, 22, 22, 1)' : 'rgba(252, 252, 252,1)'}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
      mode="date"
      textColor={isDarkMode ? 'white' : 'black'}
      theme={isDarkMode ? 'dark' : 'light'}
      onDateChange={RHFOnChange}
    />
  );
};
