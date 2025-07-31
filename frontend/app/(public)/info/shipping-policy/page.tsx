// frontend/app/(public)/info/shipping-policy/page.tsx
'use client';
import React from 'react';
import Link from 'next/link'; // Added import for Link
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TruckIcon } from '@/components/Icons';

const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Card className="border shadow-lg">
          <CardHeader className="text-center pb-4">
            <TruckIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">
              Política de Envío
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            <p>En SubRed Soluciones, nos esforzamos por entregar tus productos de forma rápida y segura. A continuación, detallamos nuestra política de envío:</p>
            
            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Cobertura de Envío</h3>
            <p>Realizamos envíos a todo el territorio nacional de Chile. Los costos y tiempos de entrega pueden variar según la región y la comuna de destino.</p>

            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Tiempos de Procesamiento</h3>
            <p>Los pedidos son procesados dentro de 1-2 días hábiles después de la confirmación del pago. Durante períodos de alta demanda o promociones especiales, este tiempo podría extenderse ligeramente.</p>
            
            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Tiempos de Entrega</h3>
            <ul>
              <li><strong>Región Metropolitana:</strong> 2-4 días hábiles después del procesamiento.</li>
              <li><strong>Otras Regiones:</strong> 3-7 días hábiles después del procesamiento, dependiendo de la distancia y accesibilidad.</li>
            </ul>
            <p>Estos son tiempos estimados y pueden variar debido a factores externos a nuestro control (ej. condiciones climáticas, contingencias de los operadores logísticos).</p>

            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Costos de Envío</h3>
            <p>El costo de envío se calculará automáticamente durante el proceso de checkout, basado en el peso, dimensiones del pedido y la dirección de destino. Ofrecemos opciones de envío estándar y, en algunas zonas, envío express (con costo adicional).</p>
            
            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Seguimiento de Pedidos</h3>
            <p>Una vez que tu pedido haya sido despachado, recibirás un correo electrónico con la información de seguimiento para que puedas rastrear tu paquete en tiempo real.</p>

            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Consideraciones Adicionales</h3>
            <ul>
              <li>Es responsabilidad del cliente proporcionar una dirección de envío correcta y completa. No nos hacemos responsables por retrasos o pérdidas debido a información incorrecta.</li>
              <li>Si no hay nadie para recibir el pedido en la dirección indicada, el operador logístico podría intentar una segunda entrega o dejar una notificación para el retiro en sucursal.</li>
              <li>Para productos que requieren instalación, coordinaremos la entrega junto con la visita técnica.</li>
            </ul>

            <p className="!mt-8">Si tienes alguna pregunta sobre nuestra política de envío o el estado de tu pedido, no dudes en <Link href="/info/contact" className="text-primary hover:underline">contactarnos</Link>.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;