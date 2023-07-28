import * as React from 'react';

import { Mastercard, Verve, Visa } from '@/icons';

interface CardIconProps {
  type: 'visa' | 'verve' | 'mastercard' | string | undefined;
}

export const CardIcon: React.FunctionComponent<CardIconProps> = ({ type }) => {
  const getCardIcon = () => {
    switch (type?.trim()) {
      case 'visa':
        return <Visa />;
      case 'verve':
        return <Verve />;
      case 'mastercard':
        return <Mastercard />;
      default:
        // You can choose to render a default icon or null if needed.
        return null;
    }
  };

  return <>{getCardIcon()}</>;
};
