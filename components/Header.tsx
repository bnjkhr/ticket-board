'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LabelManager from './LabelManager';

export default function Header() {
  const [showLabelManager, setShowLabelManager] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (confirm('Wirklich abmelden?')) {
      await logout();
    }
  };

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Ticket Board</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLabelManager(true)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Labels verwalten
              </button>
              <span className="text-sm text-gray-500">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-red-600"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </header>
      {showLabelManager && (
        <LabelManager onClose={() => setShowLabelManager(false)} />
      )}
    </>
  );
}
