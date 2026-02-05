
import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-neutral-900/50 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
                <h1 className="mb-8 text-3xl font-bold text-white">Política de Privacidad</h1>

                <div className="prose prose-invert prose-emerald max-w-none text-neutral-300">
                    <p>
                        En Artifact, nos tomamos su privacidad muy en serio. Esta política describe cómo recopilamos, usamos y protegemos su información personal.
                    </p>

                    <h3>1. Recopilación de Datos</h3>
                    <p>
                        Recopilamos información necesaria para la prestación del servicio, como nombre, correo electrónico y datos de facturación.
                    </p>

                    <h3>2. Uso de la Información</h3>
                    <p>
                        Utilizamos sus datos para procesar pedidos, mejorar nuestros servicios y comunicarnos con usted sobre actualizaciones importantes.
                    </p>

                    <h3>3. Seguridad</h3>
                    <p>
                        Implementamos medidas de seguridad de estándar industrial para proteger sus datos contra acceso no autorizado.
                    </p>

                    <p className="text-sm text-neutral-500 mt-12">
                        Última actualización: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
