import * as React from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { Box, DynamicText, Modal, ScrollView, TouchableOpacity } from '@/components';
import { useBooleanStateControl } from '@/hooks';
import { SelectInactiveItem, SelectTick } from '@/icons';
import { allMMKVKeys } from '@/lib/mmkv';
import { convertKebabAndSnakeToTitleCase } from '@/utils';

interface DiplayModeItemProps {
  name: string;
  value: string;
  setDisplayMode: (
    value: string | ((current: string | undefined) => string | undefined) | undefined,
  ) => void;
  closeDisplayModeModal: () => void;
  displayMode: string;
}

const DiplayModeItem: React.FunctionComponent<DiplayModeItemProps> = React.memo(
  ({ name, value, setDisplayMode, displayMode, closeDisplayModeModal }) => {
    const handleSelection = () => {
      setDisplayMode(value);
      closeDisplayModeModal();
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
        <Box alignItems="center" columnGap="2" flexDirection="row" width="70%">
          <DynamicText fontFamily="Halver-Semibold" marginLeft="1" variant="sm">
            {name}
          </DynamicText>
        </Box>

        {isSelected && <SelectTick height={16} width={16} />}
        {!isSelected && <SelectInactiveItem height={16} width={16} />}
      </TouchableOpacity>
    );
  },
);

const DISPLAY_MODES = [
  { name: 'Dark', value: 'dark' },
  { name: 'Light', value: 'light' },
  { name: 'System', value: 'system' },
];

export const DisplayModeSelectorModal: React.FunctionComponent = () => {
  const {
    state: isDisplayModeModalOpen,
    setTrue: openDisplayModeModal,
    setFalse: closeDisplayModeModal,
  } = useBooleanStateControl();

  const [displayMode = 'dark', setDisplayMode] = useMMKVString(allMMKVKeys.displayMode);

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

        <DynamicText
          fontFamily="Halver-Semibold"
          maxWidth="60%"
          numberOfLines={1}
          textAlign="right"
          variant="sm"
        >
          {convertKebabAndSnakeToTitleCase(displayMode)} ✏️
        </DynamicText>
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
          paddingBottom="8"
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
