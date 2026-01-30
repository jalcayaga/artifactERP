'use client';

import React from 'react';
import { useAuth } from '@artifact/core';
import Link from 'next/link';

const AuthStatus: React.FC = () => {
  const { isAuthenticated, currentUser, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-sm">Cargando...</div>;
  }

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated && currentUser ? (
        <>
          <span className="text-sm">Hola, {currentUser.firstName}</span>
          <button
            onClick={() => logout()}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </>
      ) : (
        <Link href="/login">
          <span className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            Login
          </span>
        </Link>
      )}
    </div>
  );
};

export default AuthStatus;
