'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@artifact/core/client';

export default function UnifiedLoginPage() {
    const router = useRouter();
    const { loginWithGoogle, loginWithMicrosoft, isLoading, user } = useSupabaseAuth();

    useEffect(() => {
        if (!isLoading && user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    const handleGoogleLogin = async (e: React.MouseEvent) => {
        e.preventDefault();
        await loginWithGoogle();
    };

    const handleMicrosoftLogin = async (e: React.MouseEvent) => {
        e.preventDefault();
        await loginWithMicrosoft();
    };

    const handleERPSelect = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = '/admin/login';
    };

    const handleStorefrontSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Native email login not implemented here directly in original, skipping
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center transition-colors duration-500">
                <svg className="animate-spin h-10 w-10 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="font-space-grotesk antialiased bg-slate-900 overflow-x-hidden min-h-screen flex flex-col items-center">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --glass-dark: rgba(15, 23, 42, 0.4);
                    --border-gradient-dark: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%);
                }
                .blob {
                    position: absolute;
                    filter: blur(80px); /* slightly less blur for stronger effect */
                    z-index: 0;
                    border-radius: 50%;
                    opacity: 0.7; /* increased opacity */
                }
                .neo-glass-dark {
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border: 1.5px solid transparent;
                    background-clip: padding-box, border-box;
                    background-origin: padding-box, border-box;
                    background-image: linear-gradient(var(--glass-dark), var(--glass-dark)), var(--border-gradient-dark);
                    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.4);
                }
                .btn-luminescent-emerald {
                    background: linear-gradient(145deg, #10b981, #059669);
                    box-shadow: 
                        0 0 0 1px rgba(16, 185, 129, 0.5),
                        0 8px 20px -4px rgba(16, 185, 129, 0.4),
                        inset 0 1px 0 rgba(255,255,255,0.2),
                        inset 0 -2px 4px rgba(0,0,0,0.1);
                }
                .btn-luminescent-orange {
                    background: linear-gradient(145deg, #f97316, #ea580c);
                    box-shadow: 
                        0 0 0 1px rgba(249, 115, 22, 0.5),
                        0 8px 20px -4px rgba(249, 115, 22, 0.4),
                        inset 0 1px 0 rgba(255,255,255,0.2);
                }
            `}} />
            <main className="flex min-h-screen w-full flex-col lg:flex-row relative z-10">
                {/* Single shared animated/gradient background for the entire page */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="blob w-[600px] h-[600px] bg-emerald-700/30 -top-20 -left-20"></div>
                    <div className="blob w-[500px] h-[500px] bg-teal-800/30 bottom-10 left-1/3"></div>
                    <div className="blob w-[600px] h-[600px] bg-indigo-900/40 -bottom-20 -right-20"></div>
                    <div className="blob w-[450px] h-[450px] bg-orange-900/30 top-1/4 right-1/4"></div>
                </div>

                {/* Left Section - Customers */}
                <section className="relative flex-1 flex flex-col items-center justify-center p-6 lg:p-12 min-h-[50vh] lg:min-h-screen">

                    <div className="relative w-full max-w-md z-10">
                        <div className="flex flex-col items-center mb-10">
                            <div className="size-16 neo-glass-dark rounded-[1.25rem] flex items-center justify-center mb-4 shadow-xl border-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-400 font-extralight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h1 className="text-[10px] font-extrabold tracking-[0.85em] uppercase text-emerald-400/40">Artifact</h1>
                        </div>
                        <div className="neo-glass-dark p-8 lg:p-11 rounded-[2.5rem]">
                            <header className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Ingreso Clientes</h2>
                                <p className="text-slate-400 font-bold tracking-[0.15em] text-[10px] uppercase opacity-70">Boutique & Pedidos Mayoristas</p>
                            </header>
                            <form className="space-y-6" onSubmit={handleStorefrontSubmit}>
                                <div className="space-y-2 group">
                                    <label className="block text-[10px] font-black text-slate-500 tracking-[0.2em] ml-2 uppercase">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative transition-all">
                                        <input className="w-full px-6 py-4 bg-black/40 border-2 border-white/5 rounded-2xl focus:ring-0 focus:border-emerald-500 transition-all outline-none text-white text-sm placeholder:text-slate-700 shadow-inner" placeholder="ejemplo@artifact.cl" type="email" />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="block text-[10px] font-black text-slate-500 tracking-[0.2em] ml-2 uppercase">
                                        Contraseña Privada
                                    </label>
                                    <div className="relative transition-all">
                                        <input className="w-full px-6 py-4 bg-black/40 border-2 border-white/5 rounded-2xl focus:ring-0 focus:border-emerald-500 transition-all outline-none text-white text-sm placeholder:text-slate-700 shadow-inner" placeholder="••••••••" type="password" />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div className="flex justify-end pr-1">
                                        <a className="text-[10px] text-emerald-500 hover:text-emerald-400 font-black uppercase tracking-widest transition-colors" href="#">¿Olvidó su clave?</a>
                                    </div>
                                </div>
                                <button className="w-full py-5 btn-luminescent-emerald text-white text-[11px] font-black rounded-2xl transition-all flex items-center justify-center gap-4 transform hover:scale-[1.01] active:scale-95 group" type="submit">
                                    <span className="tracking-[0.4em] ml-2">ENTRAR A LA TIENDA</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </form>
                            <div className="mt-10 pt-8 border-t border-white/5">
                                <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Autenticación Rápida</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={handleGoogleLogin} type="button" className="flex items-center justify-center gap-3 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/50 transition-all text-[10px] font-black text-slate-300 shadow-sm uppercase tracking-tight group">
                                        <svg className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span>Google</span>
                                    </button>
                                    <button onClick={handleMicrosoftLogin} type="button" className="flex items-center justify-center gap-3 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/50 transition-all text-[10px] font-black text-slate-300 shadow-sm uppercase tracking-tight group">
                                        <svg className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 23 23">
                                            <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                                            <path fill="#f35325" d="M1 1h10v10H1z" />
                                            <path fill="#81bc06" d="M12 1h10v10H12z" />
                                            <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                            <path fill="#ffba08" d="M12 12h10v10H12z" />
                                        </svg>
                                        <span>Office 365</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Section - Admin */}
                <section className="relative flex-1 flex flex-col items-center justify-center p-6 lg:p-12 min-h-[50vh] lg:min-h-screen">
                    <div className="relative w-full max-w-md z-10">
                        <div className="flex flex-col items-center mb-10">
                            <div className="size-16 neo-glass-dark rounded-[1.25rem] flex items-center justify-center mb-4 shadow-2xl border-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-orange-400 font-extralight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h1 className="text-[10px] font-black tracking-[0.8em] uppercase text-white/30">Artifact</h1>
                        </div>
                        <div className="neo-glass-dark p-8 lg:p-11 rounded-[2.5rem]">
                            <header className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Administración</h2>
                                <p className="text-slate-400 font-bold tracking-[0.15em] text-[10px] uppercase opacity-60">Ecosistema Central ERP</p>
                            </header>
                            <form className="space-y-6" onSubmit={handleERPSelect}>
                                <div className="space-y-2 group">
                                    <label className="block text-[10px] font-black text-slate-500 tracking-[0.2em] ml-2 uppercase">
                                        ID de Colaborador
                                    </label>
                                    <div className="relative transition-all">
                                        <input className="w-full px-6 py-4 bg-black/40 border-2 border-white/5 rounded-2xl focus:ring-0 focus:border-orange-500 transition-all outline-none text-white text-sm placeholder:text-slate-700 shadow-inner" placeholder="admin@artifact.cl" type="text" />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-400 transition-colors w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="block text-[10px] font-black text-slate-500 tracking-[0.2em] ml-2 uppercase">
                                        Token de Seguridad
                                    </label>
                                    <div className="relative transition-all">
                                        <input className="w-full px-6 py-4 bg-black/40 border-2 border-white/5 rounded-2xl focus:ring-0 focus:border-orange-500 transition-all outline-none text-white text-sm placeholder:text-slate-700 shadow-inner" placeholder="••••••••" type="password" />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-400 transition-colors w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </div>
                                    <div className="flex justify-end pr-1">
                                        <a className="text-[10px] text-slate-500 hover:text-orange-400 font-black uppercase tracking-widest transition-colors" href="#">Solicitar Acceso</a>
                                    </div>
                                </div>
                                <button className="w-full py-5 btn-luminescent-orange text-white text-[11px] font-black rounded-2xl transition-all flex items-center justify-center gap-4 transform hover:scale-[1.01] active:scale-95 group" type="submit">
                                    <span className="tracking-[0.4em] ml-2">ACCEDER AL SISTEMA</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </form>
                            <div className="mt-10 pt-8 border-t border-white/5">
                                <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Autenticación Rápida</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={handleGoogleLogin} type="button" className="flex items-center justify-center gap-3 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-orange-500/50 transition-all text-[10px] font-black text-slate-300 shadow-sm uppercase tracking-tight group">
                                        <svg className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span>Google</span>
                                    </button>
                                    <button onClick={handleMicrosoftLogin} type="button" className="flex items-center justify-center gap-3 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-orange-500/50 transition-all text-[10px] font-black text-slate-300 shadow-sm uppercase tracking-tight group">
                                        <svg className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 23 23">
                                            <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                                            <path fill="#f35325" d="M1 1h10v10H1z" />
                                            <path fill="#81bc06" d="M12 1h10v10H12z" />
                                            <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                            <path fill="#ffba08" d="M12 12h10v10H12z" />
                                        </svg>
                                        <span>Office 365</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 px-10 py-4 neo-glass-dark rounded-full text-[9px] font-black uppercase tracking-[0.3em] z-50 text-slate-500 shadow-2xl border-white/10">
                    <a className="hover:text-emerald-400 transition-colors" href="#">Soporte</a>
                    <a className="hover:text-emerald-400 transition-colors" href="#">Privacidad</a>
                    <div className="h-4 w-px bg-white/10"></div>
                    <span className="text-slate-600">Artifact Chile © 2024</span>
                </footer>
            </main>
        </div>
    );
}
