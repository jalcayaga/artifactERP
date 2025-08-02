import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Company, CreateCompanyDto, UpdateCompanyDto, UserRole } from '@/lib/types';
import { CompanyService } from '@/lib/services/companyService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CompanyForm from '@/components/CompanyForm';
import CompanyDetailModal from '@/components/CompanyDetailModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { PencilIcon, TrashIcon, EyeIcon, BriefcaseIcon, PlusIcon } from '@/components/Icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface CompanyViewProps {
  show?: 'clients' | 'suppliers';
}

const CompanyView: React.FC<CompanyViewProps> = ({ show }) => {
  const { isAuthenticated, currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);

  const fetchCompanies = useCallback(async (page: number = 1) => {
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
      const filters = { isClient: show === 'clients', isSupplier: show === 'suppliers' };
      const response = await CompanyService.getAllCompanies(page, 10, filters);
      setCompanies(response.data);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
      setTotalCompanies(response.total);
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      if (err.message && err.message.includes('Unauthorized')) {
        router.push('/login');
      } else {
        setError('Error al cargar las empresas.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, router, show]);

  useEffect(() => {
    if (!authLoading) {
      fetchCompanies(currentPage);
    }
  }, [fetchCompanies, currentPage, authLoading]);

  const handleAddNewCompany = useCallback(() => {
    setEditingCompany(null);
    setShowForm(true);
  }, []);

  const handleEditCompany = useCallback((company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  }, []);

  const handleDeleteCompanyRequest = useCallback((company: Company) => {
    setCompanyToDelete(company);
    setShowDeleteConfirmModal(true);
  }, []);
  
  const handleConfirmDeleteCompany = useCallback(async () => {
    if (companyToDelete) {
      try {
        await CompanyService.deleteCompany(companyToDelete.id);
        fetchCompanies(currentPage);
        setCompanyToDelete(null);
        setShowDeleteConfirmModal(false);
      } catch (err: any) {
        console.error('Error deleting company:', err);
        if (err.message && err.message.includes('Unauthorized')) {
          router.push('/login');
        } else {
          setError('Error al eliminar la empresa.');
        }
      }
    }
  }, [companyToDelete, fetchCompanies, currentPage, router]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setCompanyToDelete(null);
    setShowDeleteConfirmModal(false);
  }, []);

  const handleViewCompany = useCallback((company: Company) => {
    setViewingCompany(company);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setViewingCompany(null);
  }, []);

  const handleSaveCompany = useCallback(async (companyData: Company) => {
    try {
      if (editingCompany) {
        await CompanyService.updateCompany(editingCompany.id, companyData as UpdateCompanyDto);
      } else {
        await CompanyService.createCompany(companyData as CreateCompanyDto);
      }
      setShowForm(false);
      setEditingCompany(null);
      fetchCompanies(currentPage);
    } catch (err: any) {
      console.error('Error saving company:', err);
      if (err.message && err.message.includes('Unauthorized')) {
        router.push('/login');
      } else {
        setError('Error al guardar la empresa.');
      }
    }
  }, [editingCompany, fetchCompanies, currentPage, router]);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingCompany(null);
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (authLoading) {
    return <div className="text-center py-8">Cargando autenticación...</div>;
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  if (!isAuthenticated || currentUser?.role !== UserRole.ADMIN) {
    return <div className="text-center py-8 text-destructive">Acceso denegado. No tienes permisos de administrador.</div>;
  }

  if (showForm) {
    return (
      <CompanyForm
        companyData={editingCompany}
        onSave={handleSaveCompany}
        onCancel={handleCloseForm}
      />
    );
  }

  const title = show === 'clients' || show === 'suppliers' ? 'Clientes/Proveedores' : 'Empresas';
  const singularEntityName = 'Cliente/Proveedor';

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            {`Gestión de ${title}`}
          </h1>
          <Button
            className="w-full sm:w-auto"
            onClick={handleAddNewCompany}
          >
            <PlusIcon className="w-5 h-5 mr-2" /> 
            <span>{`Nueva ${singularEntityName}`}</span>
          </Button>
        </div>

        <Card className="overflow-hidden border">
          <CardContent className="p-0">
            {companies && companies.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Teléfono</TableHead>
                      <TableHead className="hidden sm:table-cell">Roles</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id} className="hover:bg-accent transition-colors duration-150">
                        <TableCell>
                          <div className="text-sm font-medium text-foreground">{company.name}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">{company.email || company.phone || '-'}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{company.email || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{company.phone || '-'}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          <div className="flex flex-wrap gap-1">
                            {company.isClient && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Cliente</span>}
                            {company.isSupplier && <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">Proveedor</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm font-medium">
                          <div className="flex items-center justify-center space-x-1 sm:space-x-3">
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleViewCompany(company)} 
                              title="Ver Detalles" 
                              aria-label={`Ver detalles de ${company.name}`}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleEditCompany(company)} 
                              title="Editar Empresa" 
                              aria-label={`Editar empresa ${company.name}`}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="ghost" size="sm"
                              onClick={() => handleDeleteCompanyRequest(company)} 
                              title="Eliminar Empresa" 
                              aria-label={`Eliminar empresa ${company.name}`}
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
                <h3 className="mt-3 text-xl font-semibold text-foreground">{`No hay ${title.toLowerCase()} registradas`}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {`Empieza añadiendo tu primer ${singularEntityName}.`}
                </p>
                <div className="mt-6">
                  <Button
                    type="button"
                    onClick={handleAddNewCompany}
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>{`Añadir Primer ${singularEntityName}`}</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {`Página ${currentPage} de ${totalPages} (Total: ${totalCompanies} ${title.toLowerCase()})`}
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
      
      {viewingCompany && (
        <CompanyDetailModal 
          company={viewingCompany}
          onClose={handleCloseDetailModal}
        />
      )}

      {showDeleteConfirmModal && companyToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleConfirmDeleteCompany}
          title="Confirmar Eliminación"
          message={<>¿Estás seguro de que quieres eliminar la empresa <strong>{companyToDelete.name}</strong>? Esta acción no se puede deshacer.</>}
          confirmText="Eliminar"
          confirmButtonClass="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          icon={<TrashIcon className="w-5 h-5 mr-2" />}
        />
      )}
    </>
  );
};

export default CompanyView;