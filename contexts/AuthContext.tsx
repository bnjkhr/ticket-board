"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification,
    applyActionCode,
    checkActionCode,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    emailVerified: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    emailVerified: false,
    signUp: async () => {},
    signIn: async () => {},
    logout: async () => {},
    resendVerificationEmail: async () => {},
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [emailVerified, setEmailVerified] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setEmailVerified(user?.emailVerified || false);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );
        // Sende Verifizierungs-Email
        await sendEmailVerification(userCredential.user);
    };

    const resendVerificationEmail = async () => {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
        }
    };

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const value = {
        user,
        loading,
        emailVerified,
        signUp,
        signIn,
        logout,
        resendVerificationEmail,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
