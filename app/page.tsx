"use client";

import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Board from "@/components/Board";
import AuthForm from "@/components/AuthForm";

export default function Home() {
    const { user, loading, emailVerified, resendVerificationEmail } = useAuth();

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

    if (!emailVerified) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-md w-full space-y-8 animate-fade-in">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-warning-500 rounded-xl flex items-center justify-center mb-4 shadow-soft">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-primary-900">
                            E-Mail bestätigen
                        </h2>
                        <p className="mt-2 text-gray-600 text-sm">
                            Bitte überprüfe deine E-Mail und klicke auf den
                            Bestätigungslink.
                        </p>
                    </div>

                    <div className="glass-effect rounded-xl p-8 shadow-medium">
                        <div className="space-y-6">
                            <div className="rounded-lg bg-warning-50 border border-warning-200 p-4">
                                <p className="text-sm text-warning-800">
                                    <strong>Fast geschafft!</strong> Wir haben
                                    dir eine Bestätigungs-E-Mail an {user.email}{" "}
                                    gesendet.
                                </p>
                            </div>

                            <div className="text-center space-y-4">
                                <button
                                    onClick={resendVerificationEmail}
                                    className="btn-secondary w-full"
                                >
                                    E-Mail erneut senden
                                </button>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-sm text-primary-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Seite aktualisieren
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
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
