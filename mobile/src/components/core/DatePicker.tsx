/**
 *  Custom date picker component.
 *  Built with modifications on: https://github.com/DieTime/react-native-date-picker
 */

import { LinearGradient } from 'expo-linear-gradient';
import _debounce from 'lodash.debounce';
import * as React from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  type DimensionValue,
} from 'react-native';

import { useIsDarkModeSelected } from '@/utils';

import { Box } from './Box';
import { DynamicText, Text } from './Text';

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
    fontSize: 15,
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
}) => {
  const isDarkMode = useIsDarkModeSelected();

  const dHeight: number = Math.round(height / 4);

  const mHeight: number = markHeight || Math.min(dHeight, 65);
  const mWidth = (markWidth || '80%') as DimensionValue;

  const offsets = digits.map((_: number, index: number) => index * dHeight);

  const fadeFilled = isDarkMode ? 'rgba(22, 22, 22, 1)' : 'rgba(252, 252, 252,1)';
  const fadeTransparent = isDarkMode ? 'rgba(22, 22, 22, 0)' : 'rgba(252, 252, 252,0)';

  const scrollRef = React.useRef<ScrollView>(null);

  const snapScrollToIndex = (index: number) => {
    scrollRef?.current?.scrollTo({ y: dHeight * index, animated: true });
  };

  const scrollToSelections = () => {
    snapScrollToIndex(value - digits[0]);
  };

  React.useEffect(() => {
    scrollToSelections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add debounce to prevent effects of momentum scroll end overfiring on Android (and causing rerenders)
  const debouncedOnChange = React.useRef(
    _debounce((_type: string, digit: number) => {
      onChange(_type, digit);
    }, 100), // Adjust the debounce delay as needed
  ).current;

  const handleMomentumScrollEnd = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const digit = Math.round(nativeEvent.contentOffset.y / dHeight + digits[0]);
    debouncedOnChange(type, digit);
  };

  return (
    <View style={styles.block}>
      <Box
        backgroundColor="datePickerMarkBackground"
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
        scrollEventThrottle={500}
        showsVerticalScrollIndicator={false}
        snapToOffsets={offsets}
        style={styles.scroll}
        onLayout={scrollToSelections} // Causes two more rerenders on IOS
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
        pointerEvents="none"
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.gradient, { bottom: 0, height: height / 4 }]}
      />
      <LinearGradient
        colors={[fadeFilled, fadeTransparent]}
        pointerEvents="none"
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.gradient, { top: 0, height: height / 4 }]}
      />
    </View>
  );
};

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

const formatAsText = ['Year', 'Month', 'Day'];
const days = Array.from({ length: 31 }, (_, index) => index + 1);
const months = Array.from({ length: 12 }, (_, index) => index + 1);

export const DatePicker: React.FC<DatePickerProps> = ({
  value: propValue,
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
  const value = React.useMemo(() => propValue || new Date(), [propValue]);

  const years = React.useMemo(() => {
    const end = endYear || new Date().getFullYear();
    const start = !startYear || startYear > end ? end - 100 : startYear;
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [startYear, endYear]);

  const pickerHeight: number = Math.round(
    height || Dimensions.get('window').height / 3.5,
  );
  const pickerWidth = (width || '100%') as DimensionValue;

  const date = React.useMemo(() => {
    const unexpectedDate: Date = new Date(years[0], 0, 1);
    return new Date(value || unexpectedDate);
  }, [value, years]);

  const changeHandle = React.useCallback(
    (type: string, digit: number): void => {
      const newDate = new Date(date);

      switch (type) {
        case 'day':
          newDate.setDate(digit);
          break;
        case 'month':
          newDate.setMonth(digit - 1);
          break;
        case 'year':
          newDate.setFullYear(digit);
          break;
      }

      // Set to Midnight UTC
      newDate.setUTCHours(0, 0, 0, 0);

      onChange(newDate);
    },
    [date, onChange],
  );

  const order = React.useMemo(
    () =>
      (format || 'dd-mm-yyyy').split('-').map((type, index) => {
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
      }),
    [date, format, years],
  );

  return (
    <>
      <Box flexDirection="row" marginBottom="2">
        {formatAsText.map(item => (
          <DynamicText
            color="gray11"
            key={item}
            textAlign="center"
            variant="xs"
            width="33.333333%"
          >
            {item}
          </DynamicText>
        ))}
      </Box>

      <View style={[styles.picker, { height: pickerHeight, width: pickerWidth }]}>
        {order.map(el => {
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
    </>
  );
};
