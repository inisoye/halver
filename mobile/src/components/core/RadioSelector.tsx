import * as React from 'react';
import { FadeIn } from 'react-native-reanimated';

import { RadioTick } from '@/icons';

import { AnimatedBox, Box } from './Box';
import { Pressable } from './Pressable';
import { Text } from './Text';

interface RadioButtonProps {
  isSelected: boolean;
  handleSelect: (value: string) => void;
  item: {
    value: string;
    name: string;
  };
}

const RadioButton: React.FunctionComponent<RadioButtonProps> = ({
  isSelected,
  handleSelect,
  item,
}) => {
  return (
    <Pressable
      alignItems="center"
      animateScale={true}
      animateTranslate={false}
      backgroundColor={
        isSelected ? 'radioButtonBackgroundSelected' : 'radioButtonBackgroundDefault'
      }
      borderRadius="md"
      flexDirection="row"
      gap="4"
      handlePressOut={() => handleSelect(item.value)}
      justifyContent="space-between"
      key={item.value}
      paddingHorizontal="4"
      paddingVertical="2"
    >
      <Text
        color={isSelected ? 'textInverse' : 'textLight'}
        fontFamily={isSelected ? 'Halver-Semibold' : 'Halver-Medium'}
        variant="sm"
      >
        {item.name}
      </Text>

      {isSelected && (
        <AnimatedBox entering={FadeIn}>
          <RadioTick />
        </AnimatedBox>
      )}
    </Pressable>
  );
};

interface RadioSelectorProps {
  data:
    | { value: string; name: string }[]
    | readonly { readonly value: string; readonly name: string }[];
  setOption(value: string): void;
  option: string;
}

export const RadioSelector = ({ data, setOption, option }: RadioSelectorProps) => {
  const handleSelect = React.useCallback(
    (value: string) => {
      setOption(value);
    },
    [setOption],
  );

  const options = data.map((item: { value: string; name: string }) => {
    const isSelected = item.value === option;

    return (
      <RadioButton
        handleSelect={handleSelect}
        isSelected={isSelected}
        item={item}
        key={item.value}
      />
    );
  });

  return (
    <Box flexDirection="row" flexWrap="wrap" gap="3" marginTop="1.5">
      {options}
    </Box>
  );
};
