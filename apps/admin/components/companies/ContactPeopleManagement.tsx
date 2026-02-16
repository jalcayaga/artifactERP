import React, { useState, useEffect } from 'react';
import { ContactPerson } from '@artifact/core';
import { ContactPersonService } from '@artifact/core/client';;
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
    <Dialog onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} open={true} onOpenChange={onClose}>
      <div className="p-0">
        <DialogHeader onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <DialogTitle onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Gestión de Personas de Contacto</DialogTitle>
          <DialogDescription onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Administra las personas de contacto vinculadas a esta empresa.
          </DialogDescription>
        </DialogHeader>
        <ContactPeopleView companyId={companyId} isManagementView={true} />
        <DialogFooter onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <Button variant='outline' onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
};

export default ContactPeopleManagement;
