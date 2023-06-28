import { BoxProps } from '@shopify/restyle';
import * as React from 'react';
import { Control, Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { KeyboardTypeOptions, useColorScheme } from 'react-native';

import { Theme } from '@/lib/restyle';
import { colors } from '@/theme';
import { isIOS } from '@/utils';

import { Box } from './Box';
import { Text } from './Text';
import { TextInput, TextInputProps } from './TextInput';

interface SearchFieldProps extends TextInputProps {
  autoFocus?: boolean;
  containerProps?: BoxProps<Theme>;
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  inputAccessoryViewID?: string;
  keyboardType?: KeyboardTypeOptions;
  name: string;
  placeholder?: string;
  prefixComponent?: React.ReactNode;
  prefixText?: string;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
  isDarker?: boolean;
}

export const SearchField: React.FunctionComponent<SearchFieldProps> = ({
  autoFocus = false,
  containerProps,
  control,
  inputAccessoryViewID,
  keyboardType,
  name,
  placeholder,
  prefixComponent,
  prefixText,
  rules,
  isDarker = false,
  ...props
}) => {
  const scheme = useColorScheme();

  return (
    <Box flexDirection="row" marginTop="1.5" {...containerProps}>
      {(!!prefixText || !!prefixComponent) && (
        <Box
          backgroundColor={isDarker ? 'inputBackgroundDarker' : 'inputBackground'}
          justifyContent="center"
          paddingLeft="6"
          paddingRight="3"
        >
          {!!prefixText && <Text color="textLight">{prefixText}</Text>}
          {!!prefixComponent && prefixComponent}
        </Box>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <TextInput
            autoFocus={autoFocus}
            backgroundColor={isDarker ? 'inputBackgroundDarker' : 'inputBackground'}
            color="inputText"
            flex={1}
            fontFamily="Halver-Medium"
            fontSize={16}
            inputAccessoryViewID={inputAccessoryViewID}
            keyboardType={keyboardType}
            paddingLeft="0"
            paddingRight="4"
            paddingVertical={isIOS() ? '3' : '2.5'}
            placeholder={placeholder}
            placeholderTextColor={
              scheme === 'light'
                ? colors['grey-a-light'][700]
                : colors['grey-a-dark'][700]
            }
            ref={ref}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            {...props}
          />
        )}
        rules={rules}
      />
    </Box>
  );
};
