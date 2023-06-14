import * as React from 'react';
import { Control, Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { KeyboardTypeOptions, TextInput, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { colors, gapStyles } from '@/theme';
import { cn } from '@/utils';

import { Text } from './Text';

interface TextFieldLabelProps {
  label: string;
  className?: string;
}

export const TextFieldLabel: React.FunctionComponent<TextFieldLabelProps> = ({
  className,
  label,
}) => {
  return (
    <Text className={className} variant="sm">
      {label}
    </Text>
  );
};

interface TextFieldProps {
  autoFocus?: boolean;
  className?: string;
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
}

export const TextField: React.FunctionComponent<TextFieldProps> = ({
  autoFocus = false,
  className,
  control,
  inputAccessoryViewID,
  keyboardType,
  name,
  placeholder,
  prefixComponent,
  prefixText,
  rules,
}) => {
  const scheme = useColorScheme();

  return (
    <View className="mt-1.5 flex-row" style={gapStyles[4]}>
      {(!!prefixText || !!prefixComponent) && (
        <View className="justify-center rounded bg-grey-light-100 px-3 dark:bg-grey-dark-200">
          {!!prefixText && <Text color="light">{prefixText}</Text>}
          {!!prefixComponent && prefixComponent}
        </View>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <TextInput
            autoFocus={autoFocus}
            className={cn(
              'flex-1 rounded bg-grey-light-100 p-3 px-4 font-sans-medium text-[16px] text-grey-light-1000 dark:bg-grey-dark-200 dark:text-grey-dark-1000',
              className,
            )}
            inputAccessoryViewID={inputAccessoryViewID}
            keyboardType={keyboardType}
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
          />
        )}
        rules={rules}
      />
    </View>
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
    <Animated.View
      className="mt-1.5 overflow-hidden rounded-sm bg-red-800 px-2 py-1 dark:bg-red-dark-600"
      entering={FadeIn}
      exiting={FadeOut}
    >
      <Text className="leading-[14px]" color="white" variant="xs" weight="bold">
        {!errorMessage || errorMessage === 'Required'
          ? `Please enter ${fieldName.toLowerCase()}.`
          : errorMessage}
      </Text>
    </Animated.View>
  );
};
