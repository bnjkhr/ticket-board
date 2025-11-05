'use client';

import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Board from '@/components/Board';
import AuthForm from '@/components/AuthForm';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Laden...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Board />
      </main>
    </div>
  );
}
