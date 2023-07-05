import * as React from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { AbsoluteKeyboardStickyButton, Box, DynamicText, Text } from '@/components';
import { convertNumberToNaira, formatNumberWithCommas } from '@/utils';

import { MINIMUM_CONTRIBUTION } from '../constants';
import {
  BillCreationMMKVPayload,
  DefinedRegisteredParticipant,
  DefinedUnregisteredParticipant,
} from '../types';
import { calculateEvenAmounts, sumTotalParticipantAllocations } from '../utils';
import { AllocationVarianceAlert, MinimumAllocationAlert } from './AllocationAlerts';
import { AmountSplitBreakdownItems } from './AmountSplitBreakdownItems';

interface SubmitButtonProps {
  disabled: boolean;
}

const SubmitButton: React.FunctionComponent<SubmitButtonProps> = React.memo(
  ({ disabled }) => {
    return (
      <AbsoluteKeyboardStickyButton
        backgroundColor="buttonCasal"
        disabled={disabled}
        position="absolute"
      >
        <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
          Continue
        </Text>
      </AbsoluteKeyboardStickyButton>
    );
  },
);

interface SplitBreakdownFormProps {
  creditor: DefinedRegisteredParticipant;
  formattedRegisteredParticipants: DefinedRegisteredParticipant[];
  formattedUnregisteredParticipants: DefinedUnregisteredParticipant[];
  newBillPayload: BillCreationMMKVPayload | undefined;
  setNewBillPayload: (value: BillCreationMMKVPayload | undefined) => void;
  totalAmountDue: string | undefined;
}

export const SplitBreakdownForm: React.FunctionComponent<SplitBreakdownFormProps> = ({
  creditor,
  formattedRegisteredParticipants,
  formattedUnregisteredParticipants,
  newBillPayload,
  setNewBillPayload,
  totalAmountDue,
}) => {
  const {
    control: controlForAmountForm,
    reset: resetAmountForm,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      registeredParticipants: formattedRegisteredParticipants,
      unregisteredParticipants: formattedUnregisteredParticipants,
    },
  });

  const allValues = useWatch({ control: controlForAmountForm });

  const totalParticipantAllocationsBreakdown =
    sumTotalParticipantAllocations(allValues);
  const totalParticipantAllocations = totalParticipantAllocationsBreakdown.total;

  const allAllocations = totalParticipantAllocationsBreakdown.allAllocations;

  const isAnyAllocationBelowMinimum = allAllocations.some(
    allocation => allocation < MINIMUM_CONTRIBUTION,
  );

  const areContributionAllocationsEqual =
    totalParticipantAllocations === Number(totalAmountDue);

  const areContributionAllocationsGreater =
    totalParticipantAllocations > Number(totalAmountDue);

  const areContributionAllocationsLess =
    totalParticipantAllocations < Number(totalAmountDue);

  const excessAmount = areContributionAllocationsGreater
    ? totalParticipantAllocations - Number(totalAmountDue)
    : 0;

  const deficitAmount = areContributionAllocationsLess
    ? Number(totalAmountDue) - totalParticipantAllocations
    : 0;

  const totalAllocationTextColor = areContributionAllocationsEqual
    ? 'green11'
    : areContributionAllocationsLess
    ? 'amber11'
    : areContributionAllocationsGreater
    ? 'tomato11'
    : undefined;

  const dirtyRegisteredContributionFields = dirtyFields.registeredParticipants;
  const dirtyRegisteredContributionFieldNames = new Set(
    dirtyRegisteredContributionFields?.flatMap(field => Object.keys(field)),
  );

  const allRegisteredFields = allValues.registeredParticipants;
  const dirtyRegisteredFields: (
    | Exclude<typeof allRegisteredFields, undefined>[number]
    | undefined
  )[] = [];
  const cleanRegisteredFields: (
    | Exclude<typeof allRegisteredFields, undefined>[number]
    | undefined
  )[] = [];
  // Obtain clean and dirty registered fields from their names
  allRegisteredFields?.forEach(field => {
    for (const key of Object.keys(field)) {
      if (dirtyRegisteredContributionFieldNames.has(key)) {
        dirtyRegisteredFields.push(field);
        cleanRegisteredFields.push(undefined); // Add undefined placeholders to keep index intact.
        return;
      }
    }
    cleanRegisteredFields.push(field);
    dirtyRegisteredFields.push(undefined); // Add undefined placeholders to keep index intact.
  });

  const dirtyUnregisteredContributionFields = dirtyFields.unregisteredParticipants;
  const dirtyUnregisteredContributionFieldNames = new Set(
    dirtyUnregisteredContributionFields?.flatMap(field => Object.keys(field)),
  );

  const allUnregisteredFields = allValues.unregisteredParticipants;
  const dirtyUnregisteredFields: (
    | Exclude<typeof allUnregisteredFields, undefined>[number]
    | undefined
  )[] = [];
  const cleanUnregisteredFields: (
    | Exclude<typeof allUnregisteredFields, undefined>[number]
    | undefined
  )[] = [];
  // Obtain clean and dirty unregistered fields from their names
  allUnregisteredFields?.forEach(field => {
    for (const key of Object.keys(field)) {
      if (dirtyUnregisteredContributionFieldNames.has(key)) {
        dirtyUnregisteredFields.push(field);
        cleanUnregisteredFields.push(undefined); // Add undefined placeholders to keep index intact.
        return;
      }
    }
    cleanUnregisteredFields.push(field);
    dirtyUnregisteredFields.push(undefined); // Add undefined placeholders to keep index intact.
  });

  const numberOfCleanRegisteredFields = cleanRegisteredFields.filter(Boolean).length;
  const numberOfCleanUnregisteredFields =
    cleanUnregisteredFields.filter(Boolean).length;
  const numberOfCleanFields =
    numberOfCleanRegisteredFields + numberOfCleanUnregisteredFields;

  const totalDirtyAllocationsBreakdown = sumTotalParticipantAllocations({
    registeredParticipants: dirtyRegisteredFields,
    unregisteredParticipants: dirtyUnregisteredFields,
  });
  const totalCleanAllocations =
    Number(totalAmountDue) - totalDirtyAllocationsBreakdown.total;

  const evenCleanFieldAmounts = calculateEvenAmounts(
    totalCleanAllocations,
    numberOfCleanFields,
  );

  const registeredCleanFieldEvenAmounts = evenCleanFieldAmounts.slice(
    0,
    numberOfCleanRegisteredFields,
  );

  const unregisteredCleanFieldEvenAmounts = evenCleanFieldAmounts.slice(
    numberOfCleanRegisteredFields,
    numberOfCleanFields + 1,
  );

  const updateCleanFieldContributions = (
    cleanFields: typeof cleanRegisteredFields | typeof cleanUnregisteredFields,
    cleanFieldEvenAmounts: number[],
    isRegistered: boolean,
  ) => {
    const result: typeof cleanFields = [];
    const definedIndexes: number[] = [];

    for (let i = 0; i < cleanFields.length; i++) {
      if (typeof cleanFields[i] !== 'undefined') {
        definedIndexes.push(i);
      }
    }

    for (let i = 0; i < cleanFields.length; i++) {
      const element = cleanFields[i];

      if (typeof element === 'object' && element !== null) {
        const modifiedElement = { ...element };

        for (let j = 0; j < definedIndexes.length; j++) {
          const index = definedIndexes[j];
          const key = `${isRegistered ? '' : 'un'}registeredContribution${index}`;

          if (modifiedElement.hasOwnProperty(key)) {
            modifiedElement[key] =
              cleanFieldEvenAmounts[j] > 0 ? String(cleanFieldEvenAmounts[j]) : '0';
          }
        }
        result.push(modifiedElement);
      } else {
        result.push(element);
      }
    }

    return result;
  };

  const updatedCleanRegisteredFields = updateCleanFieldContributions(
    cleanRegisteredFields,
    registeredCleanFieldEvenAmounts,
    true,
  );

  const updatedCleanUnregisteredFields = updateCleanFieldContributions(
    cleanUnregisteredFields,
    unregisteredCleanFieldEvenAmounts,
    false,
  );

  const allRegisteredFieldsWithUpdatedCleanFields = allRegisteredFields?.map(
    (value, index) => {
      if (updatedCleanRegisteredFields[index] !== undefined) {
        return updatedCleanRegisteredFields[index];
      }
      return value;
    },
  );

  const allUnregisteredFieldsWithUpdatedCleanFields = allUnregisteredFields?.map(
    (value, index) => {
      if (updatedCleanUnregisteredFields[index] !== undefined) {
        return updatedCleanUnregisteredFields[index];
      }
      return value;
    },
  );

  const { fields: registeredParticipantAmountFields } = useFieldArray({
    control: controlForAmountForm,
    name: 'registeredParticipants',
  });

  const { fields: unregisteredParticipantAmountFields } = useFieldArray({
    control: controlForAmountForm,
    name: 'unregisteredParticipants',
  });

  React.useEffect(() => {
    if (numberOfCleanFields > 0) {
      resetAmountForm(
        {
          registeredParticipants: allRegisteredFieldsWithUpdatedCleanFields,
          unregisteredParticipants: allUnregisteredFieldsWithUpdatedCleanFields,
        },
        { keepDirtyValues: true },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalParticipantAllocations]);

  const updateBillAmount = () => {
    if (!newBillPayload) {
      return;
    }

    setNewBillPayload({
      ...newBillPayload,
      totalAmountDue: String(totalParticipantAllocations),
    });
  };

  const isSubmitDisabled =
    isAnyAllocationBelowMinimum ||
    areContributionAllocationsGreater ||
    areContributionAllocationsLess;

  return (
    <>
      <Box
        alignItems="center"
        marginBottom="3"
        marginLeft="auto"
        marginRight="auto"
        paddingHorizontal="6"
      >
        <Box flexDirection="row">
          <Text
            color={totalAllocationTextColor}
            fontFamily="Halver-Naira"
            lineHeight={40}
          >
            ₦
          </Text>

          <DynamicText
            color={totalAllocationTextColor}
            flexDirection="row"
            fontFamily="Halver-Semibold"
            textAlign="center"
            variant="4xl"
          >
            {formatNumberWithCommas(Number(totalParticipantAllocations))}
          </DynamicText>
        </Box>

        <DynamicText color="textLight" textAlign="center" variant="sm">
          allocated out of {convertNumberToNaira(Number(totalAmountDue))}.
        </DynamicText>
      </Box>

      {isAnyAllocationBelowMinimum && <MinimumAllocationAlert />}

      {areContributionAllocationsGreater && !isAnyAllocationBelowMinimum && (
        <AllocationVarianceAlert
          totalAllocationTextColor={totalAllocationTextColor}
          updateBillAmount={updateBillAmount}
          variantAmount={excessAmount}
          isExcess
        />
      )}

      {areContributionAllocationsLess && !isAnyAllocationBelowMinimum && (
        <AllocationVarianceAlert
          isExcess={false}
          totalAllocationTextColor={totalAllocationTextColor}
          updateBillAmount={updateBillAmount}
          variantAmount={deficitAmount}
        />
      )}

      <AmountSplitBreakdownItems
        controlForAmountForm={controlForAmountForm}
        creditor={creditor}
        registeredParticipantAmountFields={registeredParticipantAmountFields}
        unregisteredParticipantAmountFields={unregisteredParticipantAmountFields}
      />

      <SubmitButton disabled={isSubmitDisabled} />
    </>
  );
};
