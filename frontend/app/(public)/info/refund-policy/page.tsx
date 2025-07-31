// frontend/app/(public)/info/refund-policy/page.tsx
'use client';
import React from 'react';
import Link from 'next/link'; // Added import for Link
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArchiveBoxIcon } from '@/components/Icons'; // Using ArchiveBoxIcon for returns/refunds

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <Card className="border shadow-lg">
          <CardHeader className="text-center pb-4">
            <ArchiveBoxIcon className="w-16 h-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">
              Política de Devoluciones y Reembolsos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            <p>En SubRed Soluciones, queremos que estés completamente satisfecho con tu compra. Si por alguna razón no lo estás, estamos aquí para ayudarte.</p>
            
            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Condiciones para Devolución</h3>
            <ul>
              <li>Tienes <strong>10 días corridos</strong> desde la fecha de recepción del producto para solicitar una devolución.</li>
              <li>El producto debe estar sin uso, en su empaque original, con todos sus accesorios, manuales y etiquetas intactas.</li>
              <li>Para productos que requieren instalación (ej. cámaras, NVRs), la devolución aplica solo si el producto no ha sido instalado y cumple con las condiciones anteriores.</li>
              <li>Servicios de instalación o consultoría ya realizados no son elegibles para devolución o reembolso.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Proceso de Devolución</h3>
            <ol>
              <li><strong>Solicitud:</strong> Contacta a nuestro equipo de atención al cliente a través de <Link href="/info/contact" className="text-primary hover:underline">nuestros canales de contacto</Link> indicando tu número de pedido y el motivo de la devolución.</li>
              <li><strong>Evaluación:</strong> Revisaremos tu solicitud y te indicaremos los pasos a seguir. Es posible que solicitemos fotografías del producto.</li>
              <li><strong>Envío del Producto:</strong> Si la devolución es aprobada, deberás enviar el producto a la dirección que te proporcionaremos. El costo de envío de la devolución corre por cuenta del cliente, a menos que la devolución sea por un error nuestro o un defecto de fábrica.</li>
              <li><strong>Inspección:</strong> Una vez recibido, el producto será inspeccionado para verificar que cumple con las condiciones de devolución.</li>
            </ol>
            
            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Reembolsos</h3>
            <ul>
              <li>Si la devolución es aprobada tras la inspección, procederemos al reembolso del valor del producto.</li>
              <li>El reembolso se realizará utilizando el mismo método de pago original dentro de los 5-10 días hábiles posteriores a la aprobación de la devolución.</li>
              <li>Los costos de envío originales no son reembolsables, excepto en casos de error por parte de SubRed o productos defectuosos.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Garantía Legal</h3>
            <p>Todos nuestros productos cuentan con la garantía legal establecida por la ley chilena. Si un producto presenta fallas de fábrica dentro del período de garantía, podrás optar por la reparación, cambio o devolución del dinero, según corresponda y previa evaluación técnica.</p>
            
            <h3 className="text-xl font-semibold text-foreground !mt-6 !mb-2">Excepciones</h3>
            <p>No se aceptarán devoluciones de software, productos personalizados o aquellos que muestren signos de mal uso, daño accidental o intervención no autorizada.</p>

            <p className="!mt-8">Para cualquier duda o consulta sobre nuestra política de devoluciones, por favor <Link href="/info/contact" className="text-primary hover:underline">contáctanos</Link>. Estamos para asistirte.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RefundPolicyPage;