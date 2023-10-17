import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';

interface AfterInteractionsProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  renderPlaceholder?: () => React.ReactNode;
}

export const AfterInteractions: React.FC<AfterInteractionsProps> = ({
  children,
  placeholder,
  renderPlaceholder,
}) => {
  const [interactionsComplete, setInteractionsComplete] = useState(false);
  const interactionHandleRef = useRef<ReturnType<
    typeof InteractionManager.runAfterInteractions
  > | null>(null);

  useEffect(() => {
    interactionHandleRef.current = InteractionManager.runAfterInteractions(
      () => {
        setInteractionsComplete(true);
        interactionHandleRef.current = null;
      },
    );

    return () => {
      if (interactionHandleRef.current) {
        interactionHandleRef.current.cancel();
      }
    };
  }, [interactionHandleRef]);

  if (interactionsComplete) {
    return <>{children}</>;
  }

  if (placeholder) {
    return <>{placeholder}</>;
  }

  if (renderPlaceholder) {
    return <>{renderPlaceholder()}</>;
  }

  return null;
};
