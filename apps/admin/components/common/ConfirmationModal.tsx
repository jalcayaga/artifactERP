'use client';

// Importaciones de React e iconos necesarios.
import React, { useEffect } from 'react';
import { XIcon } from '@artifact/ui'; // Icono para el botón de cerrar.

// Props que espera el componente ConfirmationModal.
interface ConfirmationModalProps {
  isOpen: boolean; // Indica si el modal está abierto o cerrado.
  onClose: () => void; // Función a llamar para cerrar el modal.
  onConfirm: () => void; // Función a llamar cuando se confirma la acción.
  title: string; // Título del modal.
  message: string | React.ReactNode; // Mensaje a mostrar en el modal (puede ser texto o JSX).
  confirmText?: string; // Texto para el botón de confirmación (opcional, por defecto "Confirmar").
  cancelText?: string; // Texto para el botón de cancelación (opcional, por defecto "Cancelar").
  confirmButtonClass?: string; // Clases CSS adicionales para el botón de confirmación (opcional).
  icon?: React.ReactNode; // Icono opcional para mostrar junto al título.
}

// Componente funcional para un modal de confirmación genérico.
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar', // Valor por defecto para el texto del botón de confirmación.
  cancelText = 'Cancelar', // Valor por defecto para el texto del botón de cancelación.
  confirmButtonClass = 'bg-primary hover:bg-primary/90 text-primary-foreground', // Clases por defecto para el botón de confirmación.
  icon,
}) => {
  // useEffect para manejar efectos secundarios: cerrar con Escape y bloquear scroll del body.
  useEffect(() => {
    if (!isOpen) return; // Si el modal no está abierto, no hace nada.

    // Manejador para la tecla Escape.
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(); // Cierra el modal.
      }
    };
    window.addEventListener('keydown', handleEsc); // Añade el listener.
    document.body.style.overflow = 'hidden'; // Previene el scroll del body cuando el modal está abierto.

    // Función de limpieza: se ejecuta al desmontar o antes de re-ejecutar el efecto.
    return () => {
      window.removeEventListener('keydown', handleEsc); // Limpia el listener.
      document.body.style.overflow = 'unset'; // Restaura el scroll del body.
    };
  }, [isOpen, onClose]); // Dependencias: se re-ejecuta si isOpen o onClose cambian.

  // Si el modal no está abierto, no renderiza nada.
  if (!isOpen) {
    return null;
  }

  // Renderiza el modal.
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 transition-opacity duration-300 ease-in-out'
      onClick={onClose} // Cierra el modal al hacer clic en el fondo.
      role='alertdialog' // Semántica ARIA: es un diálogo de alerta que requiere interacción.
      aria-modal='true' // Semántica ARIA: el contenido detrás está inerte.
      aria-labelledby='confirmation-modal-title' // Asocia el título para accesibilidad.
      aria-describedby='confirmation-modal-message' // Asocia el mensaje para accesibilidad.
    >
      <div
        className='bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-md flex flex-col overflow-hidden border border-border'
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre.
      >
        {/* Cabecera del modal */}
        <div className='flex items-center justify-between p-4 sm:p-5 border-b border-border'>
          <h2
            id='confirmation-modal-title'
            className='text-lg sm:text-xl font-semibold text-foreground flex items-center'
          >
            {icon && <span className='mr-2'>{icon}</span>}{' '}
            {/* Icono opcional */}
            {title} {/* Título del modal */}
          </h2>
          <button
            onClick={onClose}
            className='p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'
            aria-label='Cerrar modal' // Etiqueta para accesibilidad.
          >
            <XIcon className='w-5 h-5' /> {/* Icono de cerrar. */}
          </button>
        </div>

        {/* Cuerpo del modal con el mensaje de confirmación. */}
        <div className='p-4 sm:p-5'>
          <p
            id='confirmation-modal-message'
            className='text-sm text-foreground'
          >
            {message} {/* Mensaje del modal. */}
          </p>
        </div>

        {/* Pie del modal con los botones de acción. */}
        <div className='px-4 py-3 sm:p-5 bg-muted/50 border-t border-border flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0 space-y-reverse'>
          <button
            type='button' // Botón normal, no de envío.
            onClick={onClose}
            className='w-full sm:w-auto justify-center px-4 py-2.5 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-ring dark:focus:ring-offset-card transition-colors duration-150'
          >
            {cancelText} {/* Texto del botón de cancelar. */}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            className={`w-full sm:w-auto justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-card transition-colors duration-150 ${confirmButtonClass} focus:ring-current`} // Clases del botón de confirmar, incluyendo las personalizadas.
          >
            {confirmText} {/* Texto del botón de confirmar. */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
