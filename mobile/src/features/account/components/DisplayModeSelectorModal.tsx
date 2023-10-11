import * as React from 'react';
import { useMMKVString } from 'react-native-mmkv';

import {
  Box,
  DynamicText,
  Modal,
  ScrollView,
  TouchableOpacity,
} from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { EditPencil, SelectInactiveItem, SelectTick } from '@/icons';
import { allMMKVKeys } from '@/lib/mmkv';
import { convertKebabAndSnakeToTitleCase, isAndroid } from '@/utils';

interface DiplayModeItemProps {
  name: string;
  value: string;
  setDisplayMode: (
    value:
      | string
      | ((current: string | undefined) => string | undefined)
      | undefined,
  ) => void;
  closeDisplayModeModal: () => void;
  displayMode: string;
}

const DiplayModeItem: React.FunctionComponent<DiplayModeItemProps> = React.memo(
  ({ name, value, setDisplayMode, displayMode, closeDisplayModeModal }) => {
    const handleSelection = () => {
      closeDisplayModeModal();
      setDisplayMode(value);
    };

    const isSelected = displayMode === value;

    return (
      <TouchableOpacity
        alignItems="center"
        backgroundColor="modalElementBackground"
        borderRadius="base"
        columnGap="3"
        flexDirection="row"
        justifyContent="space-between"
        marginBottom="3.5"
        paddingHorizontal="4"
        paddingVertical="2.5"
        onPress={handleSelection}
      >
        <Box alignItems="center" columnGap="3" flexDirection="row" width="70%">
          <DynamicText fontFamily="Halver-Semibold" marginLeft="1" variant="sm">
            {name}
          </DynamicText>

          {value === 'system' && (
            <Box
              backgroundColor="defaultItemTagBg"
              borderRadius="base"
              px="1.5"
              py="0.5"
            >
              <DynamicText
                color="textWhite"
                fontFamily="Halver-Semibold"
                fontSize={9}
                variant="xxs"
              >
                Recommended
              </DynamicText>
            </Box>
          )}
        </Box>

        {isSelected && <SelectTick height={16} width={16} />}
        {!isSelected && <SelectInactiveItem height={16} width={16} />}
      </TouchableOpacity>
    );
  },
);

const DISPLAY_MODES = [
  { name: 'System', value: 'system' },
  { name: 'Dark', value: 'dark' },
  { name: 'Light', value: 'light' },
];

export const DisplayModeSelectorModal: React.FunctionComponent = () => {
  const {
    state: isDisplayModeModalOpen,
    setTrue: openDisplayModeModal,
    setFalse: closeDisplayModeModal,
  } = useBooleanStateControl();

  const [displayMode = 'system', setDisplayMode] = useMMKVString(
    allMMKVKeys.displayMode,
  );

  return (
    <>
      <TouchableOpacity
        alignItems="center"
        borderColor="borderDefault"
        borderTopWidth={true ? undefined : 1}
        flexDirection="row"
        gap="4"
        hitSlop={{ top: 5, bottom: 24, left: 24, right: 24 }}
        justifyContent="space-between"
        paddingTop="4"
        onPress={openDisplayModeModal}
      >
        <DynamicText
          color="textLight"
          fontFamily="Halver-Semibold"
          numberOfLines={1}
          variant="sm"
          width="40%"
        >
          Display mode
        </DynamicText>

        <Box
          alignItems="center"
          flexDirection="row"
          gap="2.5"
          justifyContent="flex-end"
          width="50%"
        >
          <DynamicText
            fontFamily="Halver-Semibold"
            numberOfLines={1}
            textAlign="right"
            variant="sm"
            width="80%"
          >
            {convertKebabAndSnakeToTitleCase(displayMode)}
          </DynamicText>

          <EditPencil />
        </Box>
      </TouchableOpacity>

      <Modal
        closeModal={closeDisplayModeModal}
        headingText="Select display mode"
        isLoaderOpen={false}
        isModalOpen={isDisplayModeModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          maxHeight="81%"
          paddingBottom={isAndroid() ? '2' : '6'}
          paddingHorizontal="6"
          paddingTop="6"
        >
          <ScrollView>
            {DISPLAY_MODES?.map(({ name, value }) => {
              return (
                <DiplayModeItem
                  closeDisplayModeModal={closeDisplayModeModal}
                  displayMode={displayMode}
                  key={value}
                  name={name}
                  setDisplayMode={setDisplayMode}
                  value={value}
                />
              );
            })}
          </ScrollView>
        </Box>
      </Modal>
    </>
  );
};
