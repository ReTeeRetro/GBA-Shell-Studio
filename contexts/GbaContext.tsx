import React, { createContext, useContext, ReactNode } from 'react';
import { useGbaState, GbaStateResult } from '../hooks/useGbaState';

const GbaContext = createContext<GbaStateResult | undefined>(undefined);

export const GbaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const gbaState = useGbaState();

  return (
    <GbaContext.Provider value={gbaState}>
      {children}
    </GbaContext.Provider>
  );
};

export const useGba = () => {
  const context = useContext(GbaContext);
  if (context === undefined) {
    throw new Error('useGba must be used within a GbaProvider');
  }
  return context;
};