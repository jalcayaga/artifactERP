'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Will import from core eventually, but let's stick to core exports if possible? No, we need direct client access sometimes. 
// Wait, we exported supabase from core/client. 
import { supabase as supabaseClient } from '@artifact/core/client';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // Handle the OAuth callback
        const handleCallback = async () => {
            // Supabase handles the hash parsing automatically if using the client
            const { data: { session }, error } = await supabaseClient.auth.getSession();

            if (error) {
                console.error("Auth Callback Error:", error);
                router.push('/login?error=auth_failed');
            } else if (session) {
                // Successfully logged in
                router.push('/');
            } else {
                // No session, maybe redirect to login
                router.push('/login');
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand"></div>
            <span className="ml-3 text-lg font-medium">Verificando sesión...</span>
        </div>
    );
}
