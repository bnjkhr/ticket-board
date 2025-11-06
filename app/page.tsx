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
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 animate-fade-in">
                    <div className="text-center">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-warning-500 to-orange-500 rounded-3xl flex items-center justify-center mb-4 shadow-colorful">
                            <span className="text-3xl">📧</span>
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-warning-600 to-orange-600 bg-clip-text text-transparent">
                            E-Mail bestätigen
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Bitte überprüfe deine E-Mail und klicke auf den
                            Bestätigungslink.
                        </p>
                    </div>

                    <div className="glass-effect rounded-3xl p-8 shadow-medium">
                        <div className="space-y-6">
                            <div className="rounded-2xl bg-warning-50 border border-warning-200 p-4">
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
                                    📧 E-Mail erneut senden
                                </button>

                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-sm text-primary-600 hover:text-primary-500 font-medium transition-colors"
                                >
                                    🔄 Seite aktualisieren
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
