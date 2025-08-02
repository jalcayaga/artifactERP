import React from 'react';
import { ContactPerson } from '@/lib/types';
import { XIcon, UsersIcon } from '@/components/Icons';
import ContactPersonForm from './ContactPersonForm';

interface ContactPersonModalProps {
  companyId: string;
  contactPersonData: ContactPerson | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contactPerson: ContactPerson) => void;
}

const ContactPersonModal: React.FC<ContactPersonModalProps> = ({ companyId, contactPersonData, isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-person-modal-title"
    >
      <div 
        className="bg-card text-card-foreground rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden border border-border"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
          <h2 id="contact-person-modal-title" className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
            <UsersIcon className="w-6 h-6 mr-2 text-primary" />
            {contactPersonData ? `Editar Persona de Contacto` : 'Nueva Persona de Contacto'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors" 
            aria-label="Cerrar modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-1 overflow-y-auto">
          <ContactPersonForm 
            companyId={companyId}
            contactPersonData={contactPersonData}
            onSave={onSave}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPersonModal;