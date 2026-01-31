"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Reuse UI components styles from global css
// Assuming standard CSS classes like 'container', 'form-group', 'submit-btn' exist.

enum Step {
    Account = 1,
    Business = 2,
    Plan = 3,
    Payment = 4,
    Success = 5
}

enum PlanType {
    DESPEGA = 'DESPEGA',
    CONSOLIDA = 'CONSOLIDA',
    LIDERA = 'LIDERA',
}

const steps = [
    { id: 1, label: 'Cuenta' },
    { id: 2, label: 'Negocio' },
    { id: 3, label: 'Plan' },
    { id: 4, label: 'Pago' }
];

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPlan = searchParams.get('plan');

    const [currentStep, setCurrentStep] = useState<Step>(Step.Account);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        slug: '',
        businessType: '',
        plan: initialPlan ? initialPlan.toUpperCase() : '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'companyName' && !prev.slug) {
                newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return newData;
        });
    };

    const handleNext = () => {
        setError(null);
        if (currentStep === Step.Account) {
            if (!formData.name || !formData.email || !formData.password) {
                setError('Por favor completa todos los campos.');
                return;
            }
            if (formData.password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
        }
        if (currentStep === Step.Business) {
            if (!formData.companyName) {
                setError('El nombre de la empresa es obligatorio.');
                return;
            }
        }
        if (currentStep === Step.Plan) {
            if (!formData.plan) {
                setError('Debes seleccionar un plan.');
                return;
            }
        }

        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const selectPlan = (plan: string) => {
        setFormData(prev => ({ ...prev, plan }));
    };

    const handlePaymentAndSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            // Simulate Payment Delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Call Backend API
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
            const response = await fetch(`${apiUrl}/tenants/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companyName: formData.companyName,
                    email: formData.email,
                    password: formData.password,
                    slug: formData.slug || undefined,
                    plan: formData.plan
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Error al registrar.');
            }

            const result = await response.json();
            console.log('Registration Success:', result);
            setCurrentStep(Step.Success);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Render Functions
    const renderProgressBar = () => (
        <div className="flex justify-between mb-8 max-w-xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 -z-10 transform -translate-y-1/2"></div>
            {steps.map(step => (
                <div key={step.id} className={`flex flex-col items-center bg-black px-2`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                    ${step.id <= currentStep ? 'bg-[var(--brand-color)] border-[var(--brand-color)] text-black' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                        {step.id}
                    </div>
                    <span className={`text-xs mt-2 ${step.id <= currentStep ? 'text-[var(--brand-color)]' : 'text-gray-500'}`}>{step.label}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 bg-black text-white px-4">
            <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-[var(--brand-color)] flex items-center gap-2">
                ← Volver al inicio
            </Link>

            <div className="max-w-2xl mx-auto text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Configura tu Artifact ERP</h1>
                <p className="text-gray-400">Estás a pocos pasos de digitalizar tu negocio.</p>
            </div>

            {currentStep !== Step.Success && renderProgressBar()}

            <div className="max-w-xl mx-auto bg-[var(--card-bg)] p-8 rounded-2xl border border-[var(--border-color)]">

                {/* Step 1: Account */}
                {currentStep === Step.Account && (
                    <div className="space-y-4 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4 text-[var(--brand-color)]">Tus Datos</h2>
                        <div className="form-group">
                            <label className="block text-gray-400 mb-2">Nombre Completo</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[var(--brand-color)] outline-none" placeholder="Juan Pérez" />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-400 mb-2">Correo Electrónico</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[var(--brand-color)] outline-none" placeholder="juan@empresa.com" />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-400 mb-2">Contraseña</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[var(--brand-color)] outline-none" placeholder="••••••••" />
                        </div>
                    </div>
                )}

                {/* Step 2: Business */}
                {currentStep === Step.Business && (
                    <div className="space-y-4 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4 text-[var(--brand-color)]">Tu Negocio</h2>
                        <div className="form-group">
                            <label className="block text-gray-400 mb-2">Nombre de la Empresa</label>
                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[var(--brand-color)] outline-none" placeholder="Mi Empresa SpA" />
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-400 mb-2">URL del Sistema (Slug)</label>
                            <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                                <span className="pl-3 text-gray-500">artifact.cl/</span>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-3 bg-transparent text-white outline-none" placeholder="mi-empresa" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="block text-gray-400 mb-2">Rubro</label>
                            <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[var(--brand-color)] outline-none">
                                <option value="">Seleccionar...</option>
                                <option value="RETAIL">Retail</option>
                                <option value="SERVICES">Servicios</option>
                                <option value="FOOD">Gastronomía</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 3: Plan */}
                {currentStep === Step.Plan && (
                    <div className="space-y-4 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4 text-[var(--brand-color)]">Elige tu Plan</h2>
                        <div className="grid gap-4">
                            {[PlanType.DESPEGA, PlanType.CONSOLIDA, PlanType.LIDERA].map(plan => (
                                <div
                                    key={plan}
                                    onClick={() => selectPlan(plan)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.plan === plan ? 'border-[var(--brand-color)] bg-[rgba(0,255,127,0.1)]' : 'border-gray-700 hover:border-gray-500'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">{plan}</span>
                                        {formData.plan === plan && <span className="text-[var(--brand-color)]">✓</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Payment */}
                {currentStep === Step.Payment && (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4 text-[var(--brand-color)]">Resumen y Pago</h2>
                        <div className="bg-gray-900 p-4 rounded-lg space-y-2 text-sm text-gray-300">
                            <div className="flex justify-between">
                                <span>Empresa:</span>
                                <span className="text-white font-medium">{formData.companyName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Usuario Maestro:</span>
                                <span className="text-white font-medium">{formData.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Plan Seleccionado:</span>
                                <span className="text-[var(--brand-color)] font-bold">{formData.plan}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-700 pt-4">
                            <p className="text-center text-gray-400 mb-4 text-sm">Simulación de Pasarela de Pago (Webpay/Stripe)</p>
                            <div className="bg-gray-800 h-12 rounded flex items-center justify-center text-gray-500">
                                [ Tarjeta de Crédito **** **** **** 4242 ]
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Success */}
                {currentStep === Step.Success && (
                    <div className="text-center py-8 animate-fadeIn">
                        <div className="w-20 h-20 bg-[var(--brand-color)] rounded-full flex items-center justify-center text-black text-4xl mx-auto mb-6">
                            ✓
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white">¡Todo listo!</h2>
                        <p className="text-gray-400 mb-8">
                            Tu entorno <strong>{formData.companyName}</strong> ha sido creado exitosamente.
                        </p>

                        <div className="space-y-4">
                            <a
                                href="http://localhost:3001"
                                target="_blank"
                                className="block w-full py-4 bg-[var(--brand-color)] text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Ir a mi Panel Admin
                            </a>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg mt-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Navigation Buttons */}
                {currentStep !== Step.Success && (
                    <div className="flex gap-4 mt-8">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="flex-1 py-3 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-400 transition-colors"
                            >
                                Atrás
                            </button>
                        )}

                        {currentStep < 4 ? (
                            <button
                                onClick={handleNext}
                                className="flex-1 py-3 bg-[var(--brand-color)] text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Continuar
                            </button>
                        ) : (
                            <button
                                onClick={handlePaymentAndSubmit}
                                disabled={loading}
                                className={`flex-1 py-3 bg-[var(--brand-color)] text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? 'Procesando...' : 'Pagar y Crear Cuenta'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
