import * as React from 'react';
import { FadeIn } from 'react-native-reanimated';

import { RadioTick } from '@/icons';

import { AnimatedBox, Box } from './Box';
import { Text } from './Text';
import { TouchableOpacity } from './TouchableOpacity';

interface RadioButtonProps {
  isSelected: boolean;
  handleSelect: (value: string) => void;
  item: {
    value: string;
    name: string;
  };
}

const RadioButton: React.FunctionComponent<RadioButtonProps> = React.memo(
  ({ isSelected, handleSelect, item }) => {
    const onButtonPress = () => {
      handleSelect(item.value);
    };

    return (
      <TouchableOpacity
        alignItems="center"
        backgroundColor={
          isSelected ? 'radioButtonBackgroundSelected' : 'inputBackground'
        }
        borderRadius="md"
        flexDirection="row"
        gap="4"
        justifyContent="space-between"
        key={item.value}
        paddingHorizontal="4"
        paddingVertical="2"
        onPress={onButtonPress}
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
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.isSelected === nextProps.isSelected;
  },
);

interface RadioSelectorProps {
  data:
    | { value: string; name: string }[]
    | readonly { readonly value: string; readonly name: string }[];
  setOption(value: string): void;
  option: string;
  customEventHander?: () => void;
}

export const RadioSelector = ({
  data,
  setOption,
  option,
  customEventHander,
}: RadioSelectorProps) => {
  const handleSelect = React.useCallback((value: string) => {
    setOption(value);
    customEventHander?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
