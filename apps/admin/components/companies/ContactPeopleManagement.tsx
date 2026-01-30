import React, { useState, useEffect } from 'react';
import { ContactPerson, ContactPersonService } from '@artifact/core';
import { Button } from '@artifact/ui';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@artifact/ui';
import { PlusIcon, PencilIcon, TrashIcon } from '@artifact/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@artifact/ui';
import { ContactPersonForm } from './ContactPersonForm';
import ContactPeopleView from './ContactPeopleView';

interface ContactPeopleManagementProps {
  companyId: string;
  onClose: () => void;
}

const ContactPeopleManagement: React.FC<ContactPeopleManagementProps> = ({
  companyId,
  onClose,
}) => {
  const [contactPeople, setContactPeople] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestión de Personas de Contacto</DialogTitle>
          <DialogDescription>
            Aquí puedes gestionar las personas de contacto asociadas a esta
            empresa.
          </DialogDescription>
        </DialogHeader>
        <ContactPeopleView companyId={companyId} isManagementView={true} />
        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactPeopleManagement;
