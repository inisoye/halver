import * as React from 'react';
import { Control, Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { KeyboardTypeOptions, TextInput, View } from 'react-native';

import { Text } from './Text';

interface TextFieldLabelProps {
  label: string;
}

export const TextFieldLabel: React.FunctionComponent<TextFieldLabelProps> = ({ label }) => {
  return (
    <Text color="light" variant="sm">
      {label}
    </Text>
  );
};

interface TextFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  keyboardType?: KeyboardTypeOptions;
  inputAccessoryViewID?: string;
  name: string;
  prefixText?: string;
  rules?:
    | Omit<
        RegisterOptions<FieldValues, string>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
    | undefined;
}

export const TextField: React.FunctionComponent<TextFieldProps> = ({
  control,
  keyboardType,
  inputAccessoryViewID,
  name,
  prefixText,
  rules,
}) => {
  return (
    <View
      className="mt-1.5 flex-row"
      style={{ gap: 4 }} // eslint-disable-line react-native/no-inline-styles
    >
      {!!prefixText && (
        <View className="justify-center rounded bg-grey-light-200 px-3 dark:bg-grey-dark-200">
          <Text color="light">{prefixText}</Text>
        </View>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="flex-1 rounded bg-grey-light-200 p-3 font-sans-medium text-[16px] text-grey-light-1000 dark:bg-grey-dark-200 dark:text-grey-dark-1000"
            inputAccessoryViewID={inputAccessoryViewID}
            keyboardType={keyboardType}
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
    <View className="mt-1.5 overflow-hidden rounded-sm bg-red-dark-700 px-2 py-1 dark:bg-red-dark-500">
      <Text className="leading-[14px]" color="white" variant="xs" weight="bold">
        {!errorMessage || errorMessage === 'Required'
          ? `Please enter ${fieldName.toLowerCase()}.`
          : errorMessage}
      </Text>
    </View>
  );
};
