import React, { useState, useEffect } from 'react';
import { ContactPerson } from '@/lib/types';
import { ContactPersonService } from '@/lib/services/contactPersonService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusIcon, PencilIcon, TrashIcon } from '@/components/Icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import ContactPersonForm from './ContactPersonForm';
import ContactPeopleView from './ContactPeopleView';

interface ContactPeopleManagementProps {
  companyId: string;
  onClose: () => void;
}

const ContactPeopleManagement: React.FC<ContactPeopleManagementProps> = ({ companyId, onClose }) => {
  const [contactPeople, setContactPeople] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactPersonForm, setShowContactPersonForm] = useState(false);
  const [editingContactPerson, setEditingContactPerson] = useState<ContactPerson | null>(null);

  const fetchContactPeople = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ContactPersonService.getAllContactPeople(companyId);
      setContactPeople(response.data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las personas de contacto.');
      toast.error(err.message || 'Error al cargar las personas de contacto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactPeople();
  }, [companyId]);

  const handleAddContactPerson = () => {
    setEditingContactPerson(null);
    setShowContactPersonForm(true);
  };

  const handleEditContactPerson = (contactPerson: ContactPerson) => {
    setEditingContactPerson(contactPerson);
    setShowContactPersonForm(true);
  };

  const handleDeleteContactPerson = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta persona de contacto?')) {
      try {
        await ContactPersonService.deleteContactPerson(companyId, id);
        toast.success('Persona de contacto eliminada exitosamente.');
        fetchContactPeople();
      } catch (err: any) {
        toast.error(err.message || 'Error al eliminar la persona de contacto.');
      }
    }
  };

  const handleSaveContactPerson = () => {
    setShowContactPersonForm(false);
    fetchContactPeople();
  };

  if (loading) return <div>Cargando personas de contacto...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Gestión de Personas de Contacto</DialogTitle>
          <DialogDescription>
            Aquí puedes gestionar las personas de contacto asociadas a esta empresa.
          </DialogDescription>
        </DialogHeader>
        {!showContactPersonForm ? (
          <ContactPeopleView companyId={companyId} isManagementView={true} />
        ) : (
          <ContactPersonForm
            companyId={companyId}
            contactPersonData={editingContactPerson}
            onSave={handleSaveContactPerson}
            onCancel={() => setShowContactPersonForm(false)}
          />
        )}
        <DialogFooter>
          {!showContactPersonForm && (
            <Button variant="outline" onClick={onClose}>Cerrar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactPeopleManagement;