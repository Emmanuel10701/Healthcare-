"use client"; // This component must be a client component

import { SessionProvider } from 'next-auth/react';

const SessionProviderWrapper = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
