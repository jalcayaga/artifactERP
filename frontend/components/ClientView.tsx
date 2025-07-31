// Importaciones de React, tipos y componentes/iconos necesarios.
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importar useRouter
import { useAuth } from '@/contexts/AuthContext';
import { Client, CreateClientDto, UpdateClientDto, UserRole } from '@/lib/types'; 
import { ClientService } from '@/lib/services/clientService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import ClientForm from '@/components/ClientForm';
import ClientDetailModal from '@/components/ClientDetailModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PencilIcon, TrashIcon, EyeIcon, BriefcaseIcon, PlusIcon } from '@/components/Icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const ClientView: React.FC = () => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter(); // Inicializar useRouter
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClients, setTotalClients] = useState(0);

  const fetchClients = useCallback(async (page: number = 1) => {
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
      const response = await ClientService.getAllClients(page);
      setClients(response.data);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
      setTotalClients(response.total);
    } catch (err: any) { // Usar 'any' para acceder a 'message'
      console.error('Error fetching clients:', err);
      if (err.message && err.message.includes('Unauthorized')) {
        router.push('/login'); // Redirigir al login en caso de 401
      } else {
        setError('Error al cargar los clientes.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, router]); // Añadir isAuthenticated a las dependencias

  useEffect(() => {
    if (!authLoading) {
      fetchClients(currentPage);
    }
  }, [fetchClients, currentPage, authLoading]);

  const handleAddNewClient = useCallback(() => {
    setEditingClient(null);
    setShowForm(true);
  }, []);

  const handleEditClient = useCallback((client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  }, []);

  const handleDeleteClientRequest = useCallback((client: Client) => {
    setClientToDelete(client);
    setShowDeleteConfirmModal(true);
  }, []);
  
  const handleConfirmDeleteClient = useCallback(async () => {
    if (clientToDelete) {
      try {
        await ClientService.deleteClient(clientToDelete.id);
        fetchClients(currentPage);
        setClientToDelete(null);
        setShowDeleteConfirmModal(false);
      } catch (err: any) {
        console.error('Error deleting client:', err);
        if (err.message && err.message.includes('Unauthorized')) {
          router.push('/login');
        } else {
          setError('Error al eliminar el cliente.');
        }
      }
    }
  }, [clientToDelete, fetchClients, currentPage, router]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setClientToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);

  const handleViewClient = useCallback((client: Client) => {
    setViewingClient(client);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setViewingClient(null);
  }, []);

  const handleSaveClient = useCallback(async (clientData: Client) => {
    try {
      if (editingClient) {
        await ClientService.updateClient(editingClient.id, clientData as UpdateClientDto);
      } else {
        await ClientService.createClient(clientData as CreateClientDto);
      }
      setShowForm(false);
      setEditingClient(null);
      fetchClients(currentPage);
    } catch (err: any) {
      console.error('Error saving client:', err);
      if (err.message && err.message.includes('Unauthorized')) {
        router.push('/login');
      } else {
        setError('Error al guardar el cliente.');
      }
    }
  }, [editingClient, fetchClients, currentPage, router]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingClient(null);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (authLoading) {
    return <div className="text-center py-8">Cargando autenticación...</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Cargando clientes...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos de administrador.</div>;
  }

  if (showForm) {
    return (
      <ClientForm
        clientData={editingClient}
        onSave={handleSaveClient}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Gestión de Clientes
          </h1>
          <Button
            className="w-full sm:w-auto"
            onClick={handleAddNewClient}
          >
            <PlusIcon className="w-5 h-5 mr-2" /> 
            <span>Nuevo Cliente</span>
          </Button>
        </div>

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {clients.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                      <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-accent transition-colors duration-150">
                        <TableCell>
                          <div className="text-sm font-medium text-foreground">{client.name}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">{client.email || client.phone || client.type}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{client.email || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{client.phone || '-'}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.type === 'Empresa' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary-foreground'
                          }`}>
                            {client.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-sm font-medium">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-3">
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleViewClient(client)} 
                              title="Ver Detalles" 
                              aria-label={`Ver detalles de ${client.name}`}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleEditClient(client)} 
                              title="Editar Cliente" 
                              aria-label={`Editar cliente ${client.name}`}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleDeleteClientRequest(client)} 
                              title="Eliminar Cliente" 
                              aria-label={`Eliminar cliente ${client.name}`}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <BriefcaseIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">No hay clientes registrados</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Empieza añadiendo tu primer cliente para gestionar sus datos y actividades.
                </p>
                <div className="mt-6">
                  <Button
                    type="button"
                    onClick={handleAddNewClient}
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Añadir Primer Cliente</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} (Total: {totalClients} clientes)
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
      
      {viewingClient && (
        <ClientDetailModal 
          client={viewingClient}
          onClose={handleCloseDetailModal}
        />
      )}

      {showDeleteConfirmModal && clientToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeleteClient}
          title="Confirmar Eliminación"
          message={<>¿Estás seguro de que quieres eliminar al cliente <strong>{clientToDelete.name}</strong>? Esta acción no se puede deshacer.</>}
          confirmText="Eliminar"
          confirmButtonClass="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          icon={<TrashIcon className="w-5 h-5 mr-2" />}
        />
      )}
    </>
  );
};

export default ClientView;