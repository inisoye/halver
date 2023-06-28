import { BoxProps, TextProps, useTheme } from '@shopify/restyle';
import * as React from 'react';
import { Control, Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { KeyboardTypeOptions } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';

import { Theme } from '@/lib/restyle';
import { isIOS } from '@/utils';

import { AnimatedBox, Box } from './Box';
import { Text } from './Text';
import { TextInput, TextInputProps } from './TextInput';

type TextFieldLabelProps = TextProps<Theme> & {
  label: string;
};

export const TextFieldLabel: React.FunctionComponent<TextFieldLabelProps> = ({
  label,
  ...props
}) => {
  return (
    <Text variant="sm" {...props}>
      {label}
    </Text>
  );
};

interface TextFieldProps extends TextInputProps {
  autoFocus?: boolean;
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

export const TextField: React.FunctionComponent<TextFieldProps> = ({
  autoFocus = false,
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
  const { colors } = useTheme();

  return (
    <Box flexDirection="row" gap="1" marginTop="1.5">
      {(!!prefixText || !!prefixComponent) && (
        <Box
          backgroundColor={isDarker ? 'inputBackgroundDarker' : 'inputBackground'}
          borderRadius="base"
          justifyContent="center"
          paddingHorizontal="3"
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
            borderRadius="base"
            color="inputText"
            flex={1}
            fontFamily="Halver-Medium"
            fontSize={16}
            inputAccessoryViewID={inputAccessoryViewID}
            keyboardType={keyboardType}
            paddingHorizontal="4"
            paddingVertical={isIOS() ? '3' : '2.5'}
            placeholder={placeholder}
            placeholderTextColor={colors.inputPlaceholder}
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

interface TextFieldErrorProps {
  errorMessage: string | undefined;
  fieldName: string;
}

export const TextFieldError: React.FunctionComponent<TextFieldErrorProps> = ({
  errorMessage,
  fieldName,
}) => {
  return (
    <AnimatedBox
      backgroundColor="inputErrorBackground"
      borderRadius="sm"
      entering={FadeIn}
      exiting={FadeOut}
      marginTop="1.5"
      overflow="hidden"
      paddingHorizontal="2"
      paddingVertical="1"
    >
      <Text color="textWhite" fontFamily="Halver-Semibold" lineHeight={14} variant="xs">
        {!errorMessage || errorMessage === 'Required'
          ? `Please enter ${fieldName.toLowerCase()}.`
          : errorMessage}
      </Text>
    </AnimatedBox>
  );
};

interface FullWidthTextFieldProps extends TextInputProps {
  autoFocus?: boolean;
  containerProps?: BoxProps<Theme>;
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  inputAccessoryViewID?: string;
  keyboardType?: KeyboardTypeOptions;
  name: string;
  placeholder?: string;
  prefixComponent?: React.ReactNode;
  prefixText?: string;
  suffixComponent?: React.ReactNode;
  suffixText?: string;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
  isDarker?: boolean;
}

export const FullWidthTextField: React.FunctionComponent<FullWidthTextFieldProps> = ({
  autoFocus = false,
  containerProps,
  control,
  inputAccessoryViewID,
  keyboardType,
  name,
  placeholder,
  prefixComponent,
  prefixText,
  suffixComponent,
  suffixText,
  rules,
  isDarker = false,
  ...props
}) => {
  const { colors } = useTheme();

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
            paddingHorizontal="6"
            paddingVertical={isIOS() ? '3.5' : '3'}
            placeholder={placeholder}
            placeholderTextColor={colors.inputPlaceholder}
            ref={ref}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            {...props}
          />
        )}
        rules={rules}
      />

      {(!!suffixText || !!suffixComponent) && (
        <Box
          backgroundColor={isDarker ? 'inputBackgroundDarker' : 'inputBackground'}
          justifyContent="center"
          paddingLeft="3"
          paddingRight="6"
        >
          {!!suffixText && <Text color="textLight">{suffixText}</Text>}
          {!!suffixComponent && suffixComponent}
        </Box>
      )}
    </Box>
  );
};
