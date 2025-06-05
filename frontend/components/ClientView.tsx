// Importaciones de React, tipos y componentes/iconos necesarios.
import React, { useState, useCallback, useEffect } from 'react';
import { Client } from '@/lib/types'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import ClientForm from '@/components/ClientForm';
import ClientDetailModal from '@/components/ClientDetailModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PencilIcon, TrashIcon, EyeIcon, BriefcaseIcon, PlusIcon } from '@/components/Icons';

const initialMockClients: Client[] = [
  { id: '1', name: 'Tech Solutions Inc.', email: 'contact@techsolutions.com', phone: '555-0101', type: 'Empresa', contactName: 'Jane Doe' },
  { id: '2', name: 'Marketing Pros LLC', email: 'info@marketingpros.com', phone: '555-0102', type: 'Empresa', contactName: 'John Smith' },
  { id: '3', name: 'Ana García (Freelancer)', email: 'ana.garcia@email.com', phone: '555-0103', type: 'Persona' },
  { id: '4', name: 'Constructora Global', email: 'proyectos@global.com', phone: '555-0104', type: 'Empresa', contactName: 'Carlos López' },
  { id: '5', name: 'Luis Martínez', email: 'luis.martinez@email.net', phone: '555-0105', type: 'Persona' },
];

const LOCAL_STORAGE_KEY_CLIENTS = 'wolfflow_clients';

const ClientView: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const storedClients = localStorage.getItem(LOCAL_STORAGE_KEY_CLIENTS);
      return storedClients ? JSON.parse(storedClients) : initialMockClients;
    } catch (error) {
      console.error("Error loading clients from localStorage:", error);
      return initialMockClients;
    }
  });
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    } catch (error) {
      console.error("Error saving clients to localStorage:", error);
    }
  }, [clients]);

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
  
  const handleConfirmDeleteClient = useCallback(() => {
    if (clientToDelete) {
      setClients(prevClients => prevClients.filter(client => client.id !== clientToDelete.id));
      setClientToDelete(null);
      setShowDeleteConfirmModal(false);
    }
  }, [clientToDelete]);

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

  const handleSaveClient = useCallback((clientData: Client) => {
    setClients(prevClients => {
      if (editingClient) {
        return prevClients.map(c => (c.id === clientData.id ? clientData : c));
      } else {
        const newId = clientData.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return [...prevClients, { ...clientData, id: newId }];
      }
    });
    setShowForm(false);
    setEditingClient(null);
  }, [editingClient]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingClient(null);
  }, []);

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
          <button
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2"
            onClick={handleAddNewClient}
            aria-label="Añadir Nuevo Cliente"
          >
            <PlusIcon className="w-5 h-5" /> 
            <span>Nuevo Cliente</span>
          </button>
        </div>

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {clients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Teléfono</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Tipo</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-accent transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-foreground">{client.name}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">{client.email || client.phone || client.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">{client.email || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden md:table-cell">{client.phone || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground hidden sm:table-cell">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.type === 'Empresa' ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {client.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-3">
                            <button 
                              onClick={() => handleViewClient(client)} 
                              title="Ver Detalles" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Ver detalles de ${client.name}`}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleEditClient(client)} 
                              title="Editar Cliente" 
                              className="text-primary hover:text-primary/80 dark:hover:text-primary/70 transition-colors p-1 rounded-md hover:bg-primary/10"
                              aria-label={`Editar cliente ${client.name}`}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClientRequest(client)} 
                              title="Eliminar Cliente" 
                              className="text-destructive hover:text-destructive/80 dark:hover:text-destructive/70 transition-colors p-1 rounded-md hover:bg-destructive/10"
                              aria-label={`Eliminar cliente ${client.name}`}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <BriefcaseIcon className="mx-auto h-16 w-16 text-muted-foreground opacity-40" />
                <h3 className="mt-3 text-xl font-semibold text-foreground">No hay clientes registrados</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Empieza añadiendo tu primer cliente para gestionar sus datos y actividades.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleAddNewClient}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 px-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Añadir Primer Cliente</span>
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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