'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface SupabaseAuthContextType {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithMicrosoft: () => Promise<void>;
    loginWithEmail: (email: string) => Promise<void>;
    loginWithPassword: (email: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    signOut: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        async function initSession() {
            try {
                // 1. Check local storage for custom backend token first (prioritize our ERP auth)
                const customToken = localStorage.getItem('artifact_token') || localStorage.getItem('wolfflow_token');

                if (customToken && mounted) {
                    console.log('Restoring session from custom token...');
                    // Ideally we would decode the JWT here to get the full user object
                    // For now, we set a partial user to unblock the UI
                    try {
                        const parts = customToken.split('.');
                        if (parts.length === 3) {
                            const payload = JSON.parse(atob(parts[1]));
                            const userData = {
                                id: payload.sub || 'local-user',
                                email: payload.email,
                                firstName: payload.firstName,
                                lastName: payload.lastName,
                                role: payload.role || 'user',
                                roles: payload.roles || []
                            };
                            setUser(userData as any);
                            // Sync for old AuthContext
                            localStorage.setItem('wolfflow_user', JSON.stringify(userData));
                        } else {
                            setUser({ id: 'local-user' } as User);
                        }
                    } catch (e) {
                        setUser({ id: 'local-user' } as User);
                    }
                    setIsLoading(false);
                }

                // 2. Check Supabase session
                const { data: { session }, error } = await supabase.auth.getSession();

                if (mounted) {
                    if (error) throw error;
                    if (session) {
                        setSession(session);
                        setUser(session.user);
                    }
                    if (!customToken) {
                        setIsLoading(false);
                    }
                }
            } catch (error: any) {
                if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                    return;
                }
                console.error('Error getting session:', error);
                if (mounted) setIsLoading(false);
            }
        }

        initSession();

        // 3. Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                if (session) {
                    setSession(session);
                    setUser(session.user);
                }
                setIsLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/auth/callback',
            },
        });
        if (error) console.error('Error logging in with Google:', error.message);
    };

    const loginWithMicrosoft = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
                scopes: 'email',
                redirectTo: window.location.origin + '/auth/callback',
            },
        });
        if (error) console.error('Error logging in with Microsoft:', error.message);
    };

    const loginWithEmail = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + '/auth/callback',
            },
        });
        if (error) console.error('Error logging in with email:', error.message);
        else alert('¡Revisa tu correo para el enlace mágico!');
    };

    const loginWithPassword = async (email: string, password: string) => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.artifact.cl';

            let tenantSlug = 'artifact';
            if (typeof window !== 'undefined') {
                const parts = window.location.hostname.split('.');
                if (parts.length > 1 && parts[0] !== 'www') {
                    tenantSlug = parts[0];
                }
            }

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-slug': tenantSlug
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al iniciar sesión');
            }

            const data = await response.json();

            localStorage.setItem('wolfflow_token', data.access_token);
            localStorage.setItem('artifact_token', data.access_token);

            // Decode token to set user state
            try {
                const parts = data.access_token.split('.');
                const payload = JSON.parse(atob(parts[1]));
                const userData = {
                    id: payload.sub || 'local-user',
                    email: payload.email,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    role: payload.role || 'user',
                    roles: payload.roles || []
                };
                setUser(userData as any);
                // Sync for old AuthContext
                localStorage.setItem('wolfflow_user', JSON.stringify(userData));
            } catch (e) {
                setUser({ email, id: 'local-user' } as User);
            }

            setIsLoading(false);

            return data;
        } catch (error: any) {
            console.error('Error logging in with backend:', error.message);
            throw new Error(error.message || 'Error de conexión');
        }
    };

    const logout = async () => {
        // Clear tokens
        localStorage.removeItem('wolfflow_token');
        localStorage.removeItem('artifact_token');
        localStorage.removeItem('wolfflow_user');
        localStorage.removeItem('wolfflow_selectedCompanyId');

        // Sign out from Supabase (if active)
        try {
            const { error } = await supabase.auth.signOut();
            if (error) console.error('Error logging out from Supabase:', error.message);
        } catch (e) {
            console.error('Logout error:', e);
        }

        // Reset state
        setSession(null);
        setUser(null);

        router.push('/login');
    };

    const value = {
        session,
        user,
        isLoading,
        loginWithGoogle,
        loginWithMicrosoft,
        loginWithEmail,
        loginWithPassword,
        logout,
        signOut: logout,
    };

    return (
        <SupabaseAuthContext.Provider value={value}>
            {children}
        </SupabaseAuthContext.Provider>
    );
};

export const useSupabaseAuth = () => {
    const context = useContext(SupabaseAuthContext);
    if (context === undefined) {
        throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
    }
    return context;
};
