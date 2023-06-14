import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { RadioTick } from '@/icons';
import { gapStyles } from '@/theme';
import { cn } from '@/utils';

import { Text } from './Text';

interface RadioSelectorProps {
  data:
    | { value: string; name: string }[]
    | readonly { readonly value: string; readonly name: string }[];
  setOption(value: string): void;
  option: string;
}

export const RadioSelector = ({ data, setOption, option }: RadioSelectorProps) => {
  const handleSelect = (value: string) => {
    setOption(value);
  };

  return (
    <View className="mt-1.5 flex-row flex-wrap" style={gapStyles[12]}>
      {data.map(item => {
        const isSelected = item.value === option;

        return (
          <Pressable
            className={cn(
              'flex-row items-center rounded-md px-4 py-2',
              isSelected
                ? 'bg-apricot-700 dark:bg-apricot'
                : 'bg-grey-light-50 dark:bg-grey-dark-300 ',
            )}
            key={item.value}
            style={gapStyles[16]}
            onPress={() => handleSelect(item.value)}
          >
            <Text
              color={isSelected ? 'inverse' : 'light'}
              variant="sm"
              weight={isSelected ? 'bold' : 'default'}
            >
              {item.name}
            </Text>

            {isSelected && (
              <Animated.View entering={FadeIn}>
                <RadioTick />
              </Animated.View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};
