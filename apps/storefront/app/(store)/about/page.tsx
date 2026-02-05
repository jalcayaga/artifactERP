
import React from 'react';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Sobre <span className="text-[#00E074]">Nosotros</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-neutral-400">
                    En Artifact, estamos democratizando la tecnología empresarial. Nuestra misión es empoderar a las PyMEs chilenas con herramientas de clase mundial, sin la complejidad ni los costos prohibitivos de los sistemas tradicionales.
                </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
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
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-neutral-900/50 p-8 backdrop-blur-sm transition-colors hover:border-[#00E074]/30 hover:bg-neutral-900/80">
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <p className="mt-4 text-neutral-400">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
