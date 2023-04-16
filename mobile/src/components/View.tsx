import * as React from 'react';
import { View as RNView } from 'react-native';

import { cn } from '@/utils';

interface ViewProps {
  children: React.ReactNode;
  className: string;
}

export const View: React.FunctionComponent<ViewProps> = ({ children, className }) => {
  return (
    <RNView className={cn('bg-grey-light-100 dark:bg-grey-dark-100', className)}>{children}</RNView>
  );
};
