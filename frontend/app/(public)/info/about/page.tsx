// frontend/app/(public)/info/about/page.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BriefcaseIcon, ShieldCheckIcon } from '@/components/Icons';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Card className="border shadow-lg">
          <CardHeader className="text-center pb-4">
            <ShieldCheckIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">
              Sobre SubRed Soluciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              En SubRed, nos dedicamos a proveer soluciones integrales de seguridad y tecnología, combinando productos de vanguardia con servicios de instalación y consultoría experta. Nuestra misión es ofrecer tranquilidad y eficiencia a nuestros clientes a través de la innovación y un compromiso inquebrantable con la calidad.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center">
                  <BriefcaseIcon className="w-6 h-6 mr-2 text-secondary" />
                  Nuestra Visión
                </h3>
                <p className="text-sm">
                  Ser el proveedor líder en Chile de soluciones tecnológicas y de seguridad, reconocido por nuestra excelencia, confiabilidad y capacidad de adaptación a las necesidades cambiantes del mercado.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center">
                  <ShieldCheckIcon className="w-6 h-6 mr-2 text-primary" />
                  Nuestro Compromiso
                </h3>
                <p className="text-sm">
                  Garantizar la satisfacción de nuestros clientes mediante productos de alta calidad, servicios profesionales y un soporte técnico excepcional, construyendo relaciones a largo plazo basadas en la confianza.
                </p>
              </div>
            </div>
            <p>
              Desde nuestra fundación, hemos trabajado con una amplia gama de clientes, desde hogares y pequeñas empresas hasta grandes corporaciones, adaptando nuestras soluciones para satisfacer requerimientos específicos y superar expectativas. Creemos firmemente en el poder de la tecnología para transformar y proteger, y estamos aquí para ser tu aliado estratégico en este camino.
            </p>
            <p className="font-semibold text-foreground text-center pt-4">
              SubRed: Tu seguridad, nuestra prioridad. Tu tecnología, nuestra especialidad.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;