"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    checkRegistrationLimit,
    checkLoginLimit,
    recordRegistrationAttempt,
    recordLoginAttempt,
    getClientIP,
    type RateLimitStatus,
} from "@/lib/rateLimit";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitStatus>({
        allowed: true,
    });
    const { signIn, signUp, resendVerificationEmail } = useAuth();
    const [clientIP, setClientIP] = useState<string | null>(null);

    useEffect(() => {
        getClientIP().then(setClientIP);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        // Rate Limiting Check
        if (isLogin) {
            const limitCheck = checkLoginLimit(email, clientIP || undefined);
            if (!limitCheck.allowed) {
                const blockedInfo =
                    limitCheck.emailLimit.blockedUntil ||
                    limitCheck.ipLimit.blockedUntil;
                setRateLimitInfo({
                    allowed: false,
                    blockedUntil: blockedInfo,
                });
                setError(
                    `Zu viele Login-Versuche. Versuche es erneut um ${blockedInfo?.toLocaleTimeString()} oder kontaktiere den Support.`,
                );
                setLoading(false);
                return;
            }
            setRateLimitInfo({
                allowed: true,
                remainingAttempts: Math.min(
                    limitCheck.emailLimit.remainingAttempts || 5,
                    limitCheck.ipLimit.remainingAttempts || 5,
                ),
                resetTime:
                    limitCheck.emailLimit.resetTime ||
                    limitCheck.ipLimit.resetTime,
            });
        } else {
            const limitCheck = checkRegistrationLimit(
                email,
                clientIP || undefined,
            );
            if (!limitCheck.allowed) {
                const blockedInfo =
                    limitCheck.emailLimit.blockedUntil ||
                    limitCheck.ipLimit.blockedUntil;
                setRateLimitInfo({
                    allowed: false,
                    blockedUntil: blockedInfo,
                });
                setError(
                    `Zu viele Registrierungsversuche. Versuche es erneut um ${blockedInfo?.toLocaleTimeString()} oder kontaktiere den Support.`,
                );
                setLoading(false);
                return;
            }
            setRateLimitInfo({
                allowed: true,
                remainingAttempts: Math.min(
                    limitCheck.emailLimit.remainingAttempts || 3,
                    limitCheck.ipLimit.remainingAttempts || 3,
                ),
                resetTime:
                    limitCheck.emailLimit.resetTime ||
                    limitCheck.ipLimit.resetTime,
            });
        }

        try {
            if (isLogin) {
                await signIn(email, password);
                recordLoginAttempt(email, clientIP || undefined);
            } else {
                await signUp(email, password);
                recordRegistrationAttempt(email, clientIP || undefined);
                setSuccess(
                    "Registrierung erfolgreich! Bitte überprüfe deine E-Mail und klicke auf den Bestätigungslink.",
                );
            }
        } catch (err: any) {
            console.error(err);
            // Record failed attempt
            if (isLogin) {
                recordLoginAttempt(email, clientIP || undefined);
            } else {
                recordRegistrationAttempt(email, clientIP || undefined);
            }

            if (err.code === "auth/email-already-in-use") {
                setError("Diese E-Mail wird bereits verwendet.");
            } else if (err.code === "auth/weak-password") {
                setError("Passwort muss mindestens 6 Zeichen lang sein.");
            } else if (err.code === "auth/invalid-email") {
                setError("Ungültige E-Mail-Adresse.");
            } else if (
                err.code === "auth/user-not-found" ||
                err.code === "auth/wrong-password"
            ) {
                setError("Falsche E-Mail oder Passwort.");
            } else if (err.code === "auth/invalid-credential") {
                setError("Falsche E-Mail oder Passwort.");
            } else if (err.code === "auth/too-many-requests") {
                setError(
                    "Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.",
                );
            } else {
                setError(
                    "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        try {
            await resendVerificationEmail();
            setSuccess("Bestätigungs-E-Mail wurde erneut gesendet.");
        } catch (error) {
            setError("Fehler beim Senden der Bestätigungs-E-Mail.");
        }
    };

    const formatResetTime = (date: Date) => {
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full space-y-8 animate-fade-in">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary-900 rounded-xl flex items-center justify-center mb-4 shadow-soft">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-primary-900">
                        Ticket Board
                    </h2>
                    <p className="mt-2 text-gray-600 text-sm">
                        {isLogin ? "Melde dich an" : "Erstelle einen Account"}
                    </p>
                </div>

                <div className="glass-effect rounded-xl p-8 shadow-medium">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-lg bg-danger-50 border border-danger-200 p-4">
                                <p className="text-sm text-danger-800">
                                    {error}
                                </p>
                            </div>
                        )}

                        {success && (
                            <div className="rounded-lg bg-success-50 border border-success-200 p-4">
                                <p className="text-sm text-success-800">
                                    {success}
                                </p>
                            </div>
                        )}

                        {!isLogin &&
                            rateLimitInfo.allowed &&
                            rateLimitInfo.remainingAttempts !== undefined &&
                            rateLimitInfo.remainingAttempts < 3 && (
                                <div className="rounded-lg bg-warning-50 border border-warning-200 p-4">
                                    <p className="text-sm text-warning-800">
                                        Noch{" "}
                                        {rateLimitInfo.remainingAttempts}{" "}
                                        Registrierungsversuch(e) übrig.
                                        {rateLimitInfo.resetTime && (
                                            <span>
                                                {" "}
                                                Reset in{" "}
                                                {formatResetTime(
                                                    rateLimitInfo.resetTime,
                                                )}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}

                        {isLogin &&
                            rateLimitInfo.allowed &&
                            rateLimitInfo.remainingAttempts !== undefined &&
                            rateLimitInfo.remainingAttempts < 5 && (
                                <div className="rounded-lg bg-warning-50 border border-warning-200 p-4">
                                    <p className="text-sm text-warning-800">
                                        Noch{" "}
                                        {rateLimitInfo.remainingAttempts}{" "}
                                        Login-Versuch(e) übrig.
                                        {rateLimitInfo.resetTime && (
                                            <span>
                                                {" "}
                                                Reset in{" "}
                                                {formatResetTime(
                                                    rateLimitInfo.resetTime,
                                                )}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}

                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    E-Mail
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-all duration-200"
                                    placeholder="deine@email.de"
                                    disabled={!rateLimitInfo.allowed}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Passwort
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={
                                        isLogin
                                            ? "current-password"
                                            : "new-password"
                                    }
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent transition-all duration-200"
                                    placeholder="Mindestens 6 Zeichen"
                                    disabled={!rateLimitInfo.allowed}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    !rateLimitInfo.allowed ||
                                    !email.trim()
                                }
                                className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Bitte warten...
                                    </span>
                                ) : isLogin ? (
                                    "Anmelden"
                                ) : (
                                    "Registrieren"
                                )}
                            </button>
                        </div>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError("");
                                    setSuccess("");
                                }}
                                className="text-sm text-primary-700 hover:text-primary-600 font-medium transition-colors"
                            >
                                {isLogin
                                    ? "Noch kein Account? Registrieren"
                                    : "Bereits registriert? Anmelden"}
                            </button>
                        </div>

                        {isLogin && (
                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={handleResendVerification}
                                    className="text-xs text-gray-500 hover:text-primary-700 transition-colors"
                                >
                                    Keine Bestätigungs-E-Mail erhalten?
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
