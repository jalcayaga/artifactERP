
import React from 'react';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-neutral-900/50 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
                <h1 className="mb-8 text-3xl font-bold text-white">Términos y Condiciones</h1>

                <div className="prose prose-invert prose-emerald max-w-none text-neutral-300">
                    <p>
                        Bienvenido a Artifact Storefront. Al acceder a nuestro sitio web y utilizar nuestros servicios, usted acepta cumplir con los siguientes términos y condiciones.
                    </p>

                    <h3>1. Uso del Servicio</h3>
                    <p>
                        Nuestros servicios están diseñados para empresas y profesionales. Usted se compromete a utilizar la plataforma de manera legal y ética.
                    </p>

                    <h3>2. Propiedad Intelectual</h3>
                    <p>
                        Todo el contenido, marcas y código fuente presentes en este sitio son propiedad exclusiva de Artifact o sus licenciantes.
                    </p>

                    <h3>3. Limitación de Responsabilidad</h3>
                    <p>
                        Artifact no se hace responsable por daños indirectos o consecuentes derivados del uso de nuestra plataforma.
                    </p>

                    {/* More placeholder content */}
                    <p className="text-sm text-neutral-500 mt-12">
                        Última actualización: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
