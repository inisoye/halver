import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';

import { AddCardForm } from '@/features/financials';
import { FinancialsStackParamList } from '@/navigation';

type AddCardProps = NativeStackScreenProps<FinancialsStackParamList, 'Add your card'>;

export const AddCard: React.FunctionComponent<AddCardProps> = ({ navigation }) => {
  const onAddCardComplete = React.useCallback(() => {
    navigation.navigate('Cards');
  }, [navigation]);

  return <AddCardForm onComplete={onAddCardComplete} />;
};
