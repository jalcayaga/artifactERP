import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@artifact/ui'; // Será migrado
import { ContactPersonForm } from './ContactPersonForm'; // En la misma carpeta
import { ContactPerson } from '@artifact/core';

interface ContactPersonModalProps {
  companyId: string;
  contactPersonData: ContactPerson | null;
  onSave: (contactPerson: ContactPerson) => void;
  onClose: () => void;
  isOpen: boolean;
}

const ContactPersonModal: React.FC<ContactPersonModalProps> = ({
  companyId,
  contactPersonData,
  onSave,
  onClose,
  isOpen,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {contactPersonData
              ? 'Editar Persona de Contacto'
              : 'Nueva Persona de Contacto'}
          </DialogTitle>
          <DialogDescription>
            {contactPersonData
              ? 'Edita los detalles de la persona de contacto.'
              : 'Añade una nueva persona de contacto aquí.'}
          </DialogDescription>
        </DialogHeader>
        <ContactPersonForm
          companyId={companyId}
          contactPersonData={contactPersonData}
          onSave={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContactPersonModal;
