/**
 *  Custom date picker component.
 *  Built with modifications on: https://github.com/DieTime/react-native-date-picker
 */

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const hex2rgba = (hex: string, alpha: number): string => {
  hex = hex.replace('#', '');

  const r: number = parseInt(
    hex.length === 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2),
    16,
  );
  const g: number = parseInt(
    hex.length === 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4),
    16,
  );
  const b: number = parseInt(
    hex.length === 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6),
    16,
  );

  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

const monthsIndex: { [key: number]: string } = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    width: '100%',
  },
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  scroll: {
    width: '100%',
  },
  digit: {
    fontSize: 16,
    textAlign: 'center',
  },
  mark: {
    position: 'absolute',
    borderRadius: 6,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
  },
});

export interface DatePickerProps {
  value: Date | null | undefined;
  height?: number;
  width?: number | string;
  fontSize?: number;
  textColor?: string;
  startYear?: number;
  endYear?: number;
  markColor?: string;
  markHeight?: number;
  markWidth?: number | string;
  fadeColor?: string;
  format?: string;

  onChange(value: Date): void;
}

export interface DateBlockProps {
  digits: number[];
  value: number;
  type: string;
  height: number;
  fontSize?: number;
  textColor?: string;
  markColor?: string;
  markHeight?: number;
  markWidth?: number | string;
  fadeColor?: string;
  onChange(type: string, digit: number): void;
}

const DateBlock: React.FC<DateBlockProps> = ({
  value,
  digits,
  type,
  onChange,
  height,
  markHeight,
  markWidth,
  fadeColor,
}) => {
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';

  const dHeight: number = Math.round(height / 4);

  const mHeight: number = markHeight || Math.min(dHeight, 65);
  const mWidth: number | string = markWidth || '80%';

  const offsets = digits.map((_: number, index: number) => index * dHeight);

  const fadeFilled: string = hex2rgba(
    fadeColor || isDarkMode ? '#161616' : '#FCFCFC',
    1,
  );
  const fadeTransparent: string = hex2rgba(
    fadeColor || isDarkMode ? '#161616' : '#FCFCFC',
    0,
  );

  const scrollRef = useRef<ScrollView>(null);

  const snapScrollToIndex = (index: number) => {
    scrollRef?.current?.scrollTo({ y: dHeight * index, animated: true });
  };

  const scrollToSelections = () => {
    snapScrollToIndex(value - digits[0]);
  };

  useEffect(() => {
    scrollToSelections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef.current]);

  const handleMomentumScrollEnd = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const digit = Math.round(nativeEvent.contentOffset.y / dHeight + digits[0]);
    onChange(type, digit);
  };

  return (
    <View style={styles.block}>
      <View
        className="bg-grey-light-300 dark:bg-grey-dark-200"
        style={[
          styles.mark,
          {
            top: (height - mHeight) / 2,
            height: mHeight,
            width: mWidth,
          },
        ]}
      />
      <ScrollView
        ref={scrollRef}
        scrollEventThrottle={0}
        showsVerticalScrollIndicator={false}
        snapToOffsets={offsets}
        style={styles.scroll}
        onLayout={scrollToSelections}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
        {digits.map((value: number, index: number) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onChange(type, digits[index]);
                snapScrollToIndex(index);
              }}
            >
              <Text
                className="font-sans-medium text-base text-grey-light-1000 dark:text-grey-dark-1000"
                style={[
                  styles.digit,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    marginBottom:
                      index === digits.length - 1 ? height / 2 - dHeight / 2 : 0,
                    marginTop: index === 0 ? height / 2 - dHeight / 2 : 0,
                    lineHeight: dHeight,
                    height: dHeight,
                  },
                ]}
              >
                {type === 'month' ? monthsIndex[value] : value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <LinearGradient
        colors={[fadeTransparent, fadeFilled]}
        pointerEvents={'none'}
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.gradient, { bottom: 0, height: height / 4 }]}
      />
      <LinearGradient
        colors={[fadeFilled, fadeTransparent]}
        pointerEvents={'none'}
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.gradient, { top: 0, height: height / 4 }]}
      />
    </View>
  );
};

const formatAsText = ['Year', 'Month', 'Day'];

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  height,
  width,
  fontSize,
  textColor,
  startYear,
  endYear,
  markColor,
  markHeight,
  markWidth,
  fadeColor,
  format = 'yyyy-mm-dd',
}) => {
  const [days, setDays] = useState<number[]>([]);
  const [months, setMonths] = useState<number[]>([]);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    const end = endYear || new Date().getFullYear();
    const start = !startYear || startYear > end ? end - 100 : startYear;

    const _days = [...Array(31)].map((_, index) => index + 1);
    const _months = [...Array(12)].map((_, index) => index + 1);
    const _years = [...Array(end - start + 1)].map((_, index) => start + index);

    setDays(_days);
    setMonths(_months);
    setYears(_years);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickerHeight: number = Math.round(
    height || Dimensions.get('window').height / 3.5,
  );
  const pickerWidth: number | string = width || '100%';

  const unexpectedDate: Date = new Date(years[0], 0, 1);
  const date = new Date(value || unexpectedDate);

  const changeHandle = (type: string, digit: number): void => {
    switch (type) {
      case 'day':
        date.setDate(digit);
        break;
      case 'month':
        date.setMonth(digit - 1);
        break;
      case 'year':
        date.setFullYear(digit);
        break;
    }

    // Set to Midnigght UTC
    date.setUTCHours(0, 0, 0, 0);

    onChange(date);
  };

  const getOrder = () => {
    return (format || 'dd-mm-yyyy').split('-').map((type, index) => {
      switch (type) {
        case 'dd':
          return { name: 'day', digits: days, value: date.getDate() };
        case 'mm':
          return { name: 'month', digits: months, value: date.getMonth() + 1 };
        case 'yyyy':
          return { name: 'year', digits: years, value: date.getFullYear() };
        default:
          // eslint-disable-next-line no-console
          console.warn(
            `Invalid date picker format prop: found "${type}" in ${format}. Please read documentation!`,
          );
          return {
            name: ['day', 'month', 'year'][index],
            digits: [days, months, years][index],
            value: [date.getDate(), date.getMonth() + 1, date.getFullYear()][index],
          };
      }
    });
  };

  return (
    <View>
      <View className="mb-2 flex-row">
        {formatAsText.map(item => (
          <Text
            className="w-1/3 text-center text-[12px] text-grey-light-900 dark:text-grey-dark-900"
            key={item}
          >
            {item}
          </Text>
        ))}
      </View>

      <View style={[styles.picker, { height: pickerHeight, width: pickerWidth }]}>
        {getOrder().map(el => {
          return (
            <DateBlock
              digits={el.digits}
              fadeColor={fadeColor}
              fontSize={fontSize}
              height={pickerHeight}
              key={el.name}
              markColor={markColor}
              markHeight={markHeight}
              markWidth={markWidth}
              textColor={textColor}
              type={el.name}
              value={el.value}
              onChange={changeHandle}
            />
          );
        })}
      </View>

      <View className="mt-2 hidden flex-row">
        {formatAsText.map(item => (
          <Text
            className="w-1/3 text-center text-[12px] text-grey-light-900 dark:text-grey-dark-900"
            key={item}
          >
            {item}
          </Text>
        ))}
      </View>
    </View>
  );
};
