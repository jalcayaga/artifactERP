import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ContactPerson, UserRole } from '@/lib/types';
import { ContactPersonService } from '@/lib/services/contactPersonService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, BriefcaseIcon } from '@/components/Icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ContactPersonModal from './ContactPersonModal';
import ConfirmationModal from './ConfirmationModal';

interface ContactPeopleViewProps {
  companyId: string;
  isManagementView?: boolean; // New prop to control visibility of management elements
}

const ContactPeopleView: React.FC<ContactPeopleViewProps> = ({ companyId, isManagementView = false }) => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [contactPeople, setContactPeople] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContactPeople, setTotalContactPeople] = useState(0);
  const [editingContactPerson, setEditingContactPerson] = useState<ContactPerson | null>(null);
  const [showContactPersonModal, setShowContactPersonModal] = useState(false);
  const [contactPersonToDelete, setContactPersonToDelete] = useState<ContactPerson | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const fetchContactPeople = useCallback(async (page: number = 1) => {
    if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
      setError('No autorizado para ver esta página o no autenticado.');
      setLoading(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
      return;
    }
    setLoading(true);
    try {
      const response = await ContactPersonService.getAllContactPeople(companyId, page, 10);
      setContactPeople(response.data);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
      setTotalContactPeople(response.total);
    } catch (err: any) {
      console.error('Error fetching contact people:', err);
      if (err.message && err.message.includes('Unauthorized')) {
        router.push('/login');
      } else {
        setError('Error al cargar las personas de contacto.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, router, companyId]);

  useEffect(() => {
    if (!authLoading && companyId) {
      fetchContactPeople(currentPage);
    }
  }, [fetchContactPeople, currentPage, authLoading, companyId]);

  const handleAddNewContactPerson = useCallback(() => {
    setEditingContactPerson(null);
    setShowContactPersonModal(true);
  }, []);

  const handleEditContactPerson = useCallback((contactPerson: ContactPerson) => {
    setEditingContactPerson(contactPerson);
    setShowContactPersonModal(true);
  }, []);

  const handleSaveContactPerson = useCallback(async (contactPerson: ContactPerson) => {
    setShowContactPersonModal(false);
    setEditingContactPerson(null);
    fetchContactPeople(currentPage);
  }, [fetchContactPeople, currentPage]);

  const handleCloseContactPersonModal = useCallback(() => {
    setShowContactPersonModal(false);
    setEditingContactPerson(null);
  }, []);

  const handleDeleteContactPersonRequest = useCallback((contactPerson: ContactPerson) => {
    setContactPersonToDelete(contactPerson);
    setShowDeleteConfirmModal(true);
  }, []);

  const handleConfirmDeleteContactPerson = useCallback(async (id: string) => {
    try {
      await ContactPersonService.deleteContactPerson(companyId, id);
      fetchContactPeople(currentPage);
      setContactPersonToDelete(null);
      setShowDeleteConfirmModal(false);
      toast.success('Persona de contacto eliminada exitosamente.');
    } catch (err: any) {
      console.error('Error deleting contact person:', err);
      toast.error(err.message || 'Error al eliminar la persona de contacto.');
    }
  }, [companyId, fetchContactPeople, currentPage]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setContactPersonToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);

  const handleViewContactPerson = useCallback((contactPerson: ContactPerson) => {
    // TODO: Implement detail modal for viewing contact person
    toast.info("Funcionalidad para ver detalles de persona de contacto no implementada aún.");
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (authLoading) {
    return <div className="text-center py-8">Cargando autenticación...</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Cargando personas de contacto...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos de administrador.</div>;
  }

  return (
    <>
      <div className="space-y-6">
        {isManagementView && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Gestión de Personas de Contacto
            </h1>
            <Button
              className="w-full sm:w-auto"
              onClick={handleAddNewContactPerson}
            >
              <PlusIcon className="w-5 h-5 mr-2" /> 
              <span>Nueva Persona de Contacto</span>
            </Button>
          </div>
        )}

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {contactPeople && contactPeople.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                      {isManagementView && <TableHead className="hidden sm:table-cell">Rol</TableHead>}
                      {isManagementView && <TableHead className="text-center">Acciones</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactPeople.map((person) => (
                      <TableRow key={person.id} className="hover:bg-accent transition-colors duration-150">
                        <TableCell>
                          <div className="text-sm font-medium text-foreground">{person.firstName} {person.lastName}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">{person.email || person.phone || '-'}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{person.email || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{person.phone || '-'}</TableCell>
                        {isManagementView && <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{person.role || '-'}</TableCell>}
                        {isManagementView && (
                          <TableCell className="text-center text-sm font-medium">
                            <div className="flex items-center justify-center space-x-1 sm:space-x-3">
                              <Button 
                                variant="ghost" size="sm"
                                onClick={() => handleViewContactPerson(person)} 
                                title="Ver Detalles" 
                                aria-label={`Ver detalles de ${person.firstName}`}
                              >
                                <EyeIcon className="w-5 h-5" />
                              </Button>
                              <Button 
                                variant="ghost" size="sm"
                                onClick={() => handleEditContactPerson(person)} 
                                title="Editar Persona de Contacto" 
                                aria-label={`Editar persona de contacto ${person.firstName}`}
                              >
                                <PencilIcon className="w-5 h-5" />
                              </Button>
                              <Button 
                                variant="ghost" size="sm"
                                onClick={() => handleDeleteContactPersonRequest(person)} 
                                title="Eliminar Persona de Contacto" 
                                aria-label={`Eliminar persona de contacto ${person.firstName}`}
                              >
                                <TrashIcon className="w-5 h-5" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <BriefcaseIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">No hay personas de contacto registradas</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Empieza añadiendo tu primera persona de contacto.
                </p>
                {isManagementView && (
                  <div className="mt-6">
                    <Button
                      type="button"
                      onClick={handleAddNewContactPerson}
                    >
                      <PlusIcon className="w-5 h-5 mr-2" />
                      <span>Añadir Primera Persona de Contacto</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {`Página ${currentPage} de ${totalPages} (Total: ${totalContactPeople} personas de contacto)`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPeopleView;