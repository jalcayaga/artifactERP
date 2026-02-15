import React from 'react';

export default function InfoPage() {
    return (
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-20">
                {/* Page Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                        Información <span className="text-brand">Legal</span>
                    </h1>
                    <p className="mt-4 text-lg text-neutral-400">
                        Todo lo que necesitas saber sobre Artifact ERP
                    </p>
                </div>

                {/* About Section */}
                <section id="about">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Sobre <span className="text-brand">Nosotros</span>
                        </h2>
                        <p className="text-lg leading-8 text-neutral-400 max-w-3xl mx-auto">
                            En Artifact, estamos democratizando la tecnología empresarial. Nuestra misión es empoderar a las PyMEs chilenas con herramientas de clase mundial, sin la complejidad ni los costos prohibitivos de los sistemas tradicionales.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Misión",
                                description: "Proporcionar un ecosistema digital todo-en-uno que simplifique la operación, ventas y cumplimiento tributario para emprendedores.",
                            },
                            {
                                title: "Visión",
                                description: "Ser el estándar operativo para las empresas modernas en Latinoamérica, impulsando el crecimiento económico a través de la digitalización.",
                            },
                            {
                                title: "Valores",
                                description: "Transparencia, velocidad y diseño centrado en el humano. Creemos que el software B2B no tiene por qué ser aburrido o difícil de usar.",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,224,116,0.15)] transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Privacy Section */}
                <section id="privacy">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Política de <span className="text-brand">Privacidad</span>
                        </h2>
                        <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
                            En Artifact, nos tomamos su privacidad muy en serio. Esta política describe cómo recopilamos, usamos y protegemos su información personal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Recopilación de Datos",
                                description: "Recopilamos información necesaria para la prestación del servicio, como nombre, correo electrónico y datos de facturación. Solo solicitamos la información esencial para ofrecerte la mejor experiencia.",
                            },
                            {
                                title: "Uso de la Información",
                                description: "Utilizamos sus datos para procesar pedidos, mejorar nuestros servicios y comunicarnos con usted sobre actualizaciones importantes. Nunca compartimos su información con terceros sin su consentimiento.",
                            },
                            {
                                title: "Seguridad",
                                description: "Implementamos medidas de seguridad de estándar industrial para proteger sus datos contra acceso no autorizado. Tus datos están encriptados y almacenados de forma segura.",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,224,116,0.15)] transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-sm text-neutral-500 mt-8 text-center">
                        Última actualización: {new Date().toLocaleDateString('es-CL')}
                    </p>
                </section>

                {/* Divider */}
                <div className="border-t border-white/10" />

                {/* Terms Section */}
                <section id="terms">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Términos y <span className="text-brand">Condiciones</span>
                        </h2>
                        <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
                            Al acceder a nuestro sitio web y utilizar nuestros servicios, usted acepta cumplir con los siguientes términos y condiciones.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Uso del Servicio",
                                description: "Nuestros servicios están diseñados para empresas y profesionales. Usted se compromete a utilizar la plataforma de manera legal y ética, respetando los derechos de otros usuarios.",
                            },
                            {
                                title: "Propiedad Intelectual",
                                description: "Todo el contenido, marcas y código fuente presentes en este sitio son propiedad exclusiva de Artifact o sus licenciantes. Está prohibida su reproducción sin autorización.",
                            },
                            {
                                title: "Limitación de Responsabilidad",
                                description: "Artifact no se hace responsable por daños indirectos o consecuentes derivados del uso de nuestra plataforma. Nos esforzamos por mantener el servicio disponible y seguro.",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-brand/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,224,116,0.15)] transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-sm text-neutral-500 mt-8 text-center">
                        Última actualización: {new Date().toLocaleDateString('es-CL')}
                    </p>
                </section>
            </div>
        </div>
    );
}
