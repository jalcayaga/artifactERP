// frontend/app/(public)/info/contact/page.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatBubbleLeftEllipsisIcon, HomeIcon, TagIcon } from '@/components/Icons'; // Reusing TagIcon for phone/email

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Card className="border shadow-lg">
          <CardHeader className="text-center pb-4">
            <ChatBubbleLeftEllipsisIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">
              Contáctanos
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Estamos aquí para ayudarte. Ponte en contacto con nosotros a través de los siguientes medios o visítanos.
            </p>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <TagIcon className="w-6 h-6 mr-2 text-secondary" />
                  Información de Contacto
                </h3>
                <p className="text-muted-foreground">
                  <strong>Email:</strong> <a href="mailto:ventas@subred.cl" className="text-primary hover:underline">ventas@subred.cl</a>
                </p>
                <p className="text-muted-foreground">
                  <strong>Teléfono:</strong> <a href="tel:+569XXXXXXXX" className="text-primary hover:underline">+56 9 XXXX XXXX</a>
                </p>
                <p className="text-muted-foreground">
                  <strong>Horario de Atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <HomeIcon className="w-6 h-6 mr-2 text-secondary" />
                  Nuestra Oficina
                </h3>
                <p className="text-muted-foreground">
                  [Dirección Completa de SubRed] <br />
                  [Ciudad], [Región] <br />
                  Chile
                </p>
                <p className="text-muted-foreground">
                  <a href="https://maps.google.com/?q=[TuDireccionGoogleMaps]" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Ver en Google Maps
                  </a>
                </p>
              </div>
            </div>
            
            {/* Placeholder para un formulario de contacto simple si se desea en el futuro */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-semibold text-foreground mb-3 text-center">
                ¿Tienes una consulta rápida?
              </h3>
              <p className="text-sm text-muted-foreground text-center italic">
                (Formulario de contacto en desarrollo. Por favor, utiliza nuestro email o teléfono.)
              </p>
              {/* 
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">Nombre</label>
                  <input type="text" name="name" id="name" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background" />
                </div>
                <div>
                  <label htmlFor="email-form" className="block text-sm font-medium text-foreground">Email</label>
                  <input type="email" name="email-form" id="email-form" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground">Mensaje</label>
                  <textarea id="message" name="message" rows={4} className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background"></textarea>
                </div>
                <div className="text-right">
                  <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Enviar Mensaje
                  </button>
                </div>
              </form>
              */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;