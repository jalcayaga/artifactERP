// Importaciones de React, tipos e iconos necesarios.
import React, { useEffect } from 'react';
import { Client } from '@/lib/types'; // Tipo de dato para un cliente.
import { XIcon, BriefcaseIcon, UserCircleIcon as PersonIcon } from '@/components/Icons'; // Iconos para la UI del modal.

// Props que espera el componente ClientDetailModal.
interface ClientDetailModalProps {
  client: Client | null; // Datos del cliente a mostrar, o null si no hay cliente.
  onClose: () => void; // Función para cerrar el modal.
}

// Componente interno para mostrar un ítem de detalle (etiqueta y valor).
const DetailItem: React.FC<{ label: string; value?: string | React.ReactNode; icon?: React.FC<{className?: string}> }> = ({ label, value, icon: Icon }) => {
  // No renderiza el ítem si el valor es indefinido o una cadena vacía (a menos que sea un ReactNode, que podría ser `0` o `false`).
  if (!value && typeof value !== 'object' && typeof value !== 'boolean' && typeof value !== 'number') return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start py-2">
      {/* Etiqueta del detalle */}
      <dt className="w-full sm:w-1/3 text-sm font-medium text-muted-foreground flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-2 opacity-70" />} {/* Icono opcional */}
        {label}
      </dt>
      {/* Valor del detalle */}
      <dd className="w-full sm:w-2/3 mt-1 sm:mt-0 text-sm text-foreground">
        {value || <span className="italic text-muted-foreground">N/A</span>} {/* Muestra "N/A" si el valor es falsy pero no undefined/empty string manejado arriba. */}
      </dd>
    </div>
  );
};

// Componente funcional para el modal que muestra los detalles de un cliente.
const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, onClose }) => {
  // useEffect para manejar efectos secundarios: cerrar con Escape y bloquear scroll del body.
  useEffect(() => {
    if (!client) return; // Si no hay cliente, no hace nada.

    // Manejador para la tecla Escape.
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(); // Cierra el modal.
      }
    };
    window.addEventListener('keydown', handleEsc); // Añade el listener.

    // Previene el scroll del body cuando el modal está abierto.
    document.body.style.overflow = 'hidden';

    // Función de limpieza: se ejecuta al desmontar el componente o antes de re-ejecutar el efecto.
    return () => {
      window.removeEventListener('keydown', handleEsc); // Limpia el listener.
      document.body.style.overflow = 'unset'; // Restaura el scroll del body.
    };
  }, [client, onClose]); // Dependencias: se re-ejecuta si client o onClose cambian.

  // Si no hay cliente, no renderiza el modal.
  if (!client) {
    return null;
  }

  // Renderiza el modal.
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Cierra el modal al hacer clic en el fondo.
      role="dialog" // Semántica ARIA: es un diálogo.
      aria-modal="true" // Semántica ARIA: el contenido detrás está inerte.
      aria-labelledby="client-detail-modal-title" // Asocia el título para accesibilidad.
    >
      <div 
        className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border"
        onClick={e => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre.
      >
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b">
          <h2 id="client-detail-modal-title" className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
            {/* Icono según el tipo de cliente */}
            {client.type === 'Empresa' ? 
              <BriefcaseIcon className="w-6 h-6 mr-2 text-primary" /> : 
              <PersonIcon className="w-6 h-6 mr-2 text-green-500" /> // Keeping green for Persona type, adjust if needed
            }
            {client.name} {/* Nombre del cliente */}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors" 
            aria-label="Cerrar modal" // Etiqueta para accesibilidad.
          >
            <XIcon className="w-5 h-5" /> {/* Icono de cerrar. */}
          </button>
        </div>

        {/* Cuerpo del modal con los detalles */}
        <div className="p-4 sm:p-5 space-y-1 overflow-y-auto"> {/* Permite scroll si el contenido es largo. */}
          <dl className="divide-y divide-border/50"> {/* Lista de definiciones para los detalles. */}
            {client.contactName && <DetailItem label="Nombre de Contacto" value={client.contactName} />}
            <DetailItem label="Email" value={client.email} />
            <DetailItem label="Teléfono" value={client.phone} />
            <DetailItem 
              label="Tipo" 
              value={ // Muestra el tipo de cliente con una etiqueta coloreada.
                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  client.type === 'Empresa' ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {client.type}
                </span>
              } 
            />
          </dl>
        </div>

        {/* Pie del modal */}
        <div className="px-4 py-3 sm:px-5 bg-muted/50 border-t flex justify-end">
          <button
            type="button" // Botón normal, no de envío.
            onClick={onClose}
            className="px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring dark:focus:ring-offset-card transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailModal;