import * as React from 'react';
import { View } from 'react-native';

import { cn } from '@/utils';

interface ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FunctionComponent<ViewProps> = ({ children, className }) => {
  return (
    <View className={cn('bg-grey-light-100 dark:bg-grey-dark-200', className)}>
      {children}
    </View>
  );
};
