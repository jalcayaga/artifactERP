import React from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@artifact/ui'; // Será migrado
import { ContactPersonForm } from './ContactPersonForm'; // En la misma carpeta
import { ContactPerson } from '@artifact/core';;

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
    <Dialog onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} open={isOpen} onOpenChange={onClose}>
      <div className="p-0">
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
      </div>
    </Dialog>
  );
};

export default ContactPersonModal;
